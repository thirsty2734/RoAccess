document.addEventListener('DOMContentLoaded', function () {
    const toggleAddLinkButton = document.getElementById('toggleAddLinkButton');
    const addLinkSection = document.getElementById('addLinkSection');
    const addLinkButton = document.getElementById('addLinkButton');
    const linksList = document.getElementById('linksList');
    const aiInput = document.getElementById('aiInput');
    const aiSubmitButton = document.getElementById('aiSubmitButton');

    // Toggle Add Link Section visibility
    toggleAddLinkButton.addEventListener('click', function () {
        addLinkSection.style.display = addLinkSection.style.display === 'none' ? 'block' : 'none';
    });

    // Initialize the Add Link Section as visible
    addLinkSection.style.display = 'block';

    // Load saved links from storage
    chrome.storage.sync.get('groupLinks', function (data) {
        const savedLinks = data.groupLinks || [];
        savedLinks.forEach(linkData => addLinkToList(linkData.title, linkData.url));
    });

    // Add Link Button click event
    addLinkButton.addEventListener('click', function () {
        const groupTitle = document.getElementById('groupTitle').value;
        const groupUrl = document.getElementById('groupUrl').value;

        if (groupTitle && groupUrl) {
            addLinkToList(groupTitle, groupUrl);
            saveLink(groupTitle, groupUrl);

            document.getElementById('groupTitle').value = '';
            document.getElementById('groupUrl').value = '';
        }
    });

    // Function to add link to the list in the UI
    function addLinkToList(title, url) {
        const listItem = document.createElement('li');
        const linkButton = document.createElement('button');
        linkButton.textContent = title;
        linkButton.addEventListener('click', function () {
            window.open(url);
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', function () {
            listItem.remove();
            removeLink(title, url);
        });

        listItem.appendChild(linkButton);
        listItem.appendChild(removeButton);
        linksList.appendChild(listItem);
    }

    // Function to save a link in Chrome storage
    function saveLink(title, url) {
        chrome.storage.sync.get('groupLinks', function (data) {
            const groupLinks = data.groupLinks || [];
            groupLinks.push({ title, url });
            chrome.storage.sync.set({ groupLinks });
        });
    }

    // Function to remove a link from Chrome storage
    function removeLink(title, url) {
        chrome.storage.sync.get('groupLinks', function (data) {
            const groupLinks = data.groupLinks || [];
            const updatedLinks = groupLinks.filter(link => !(link.title === title && link.url === url));
            chrome.storage.sync.set({ groupLinks: updatedLinks });
        });
    }

    // AI Assistant Navigation
    aiSubmitButton.addEventListener('click', function () {
        const userQuery = aiInput.value.toLowerCase();
        navigateToRobloxPage(userQuery);
        aiInput.value = ''; // Clear input after submission
    });

    function navigateToRobloxPage(query) {
        // Predefined keyword-to-URL map
        const pages = {
            "avatar": "https://www.roblox.com/my/avatar",
            "profile": "https://www.roblox.com/users/profile",
            "groups": "https://www.roblox.com/groups",
            "catalog": "https://www.roblox.com/catalog",
            "friends": "https://www.roblox.com/users/friends",
            "messages": "https://www.roblox.com/my/messages",
            "trade": "https://www.roblox.com/my/trades",
            "inventory": "https://www.roblox.com/users/inventory",
            "create": "https://create.roblox.com/",
	    "discord": "https://discord.gg/mbv5h45D2S"
        };

        let matchedUrl = null;
        for (const [keyword, url] of Object.entries(pages)) {
            if (query.includes(keyword)) {
                matchedUrl = url;
                break;
            }
        }

        if (matchedUrl) {
            window.open(matchedUrl, "_blank");
        } else {
            alert("I couldn't find a page for that. Try something like 'avatar,' 'groups,' or 'create.'");
        }
    }
});
