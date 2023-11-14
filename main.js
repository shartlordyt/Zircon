document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app-container');

    // Ask the user to upload a JSON file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', handleFile);

    const fileInputLabel = document.createElement('label');
    fileInputLabel.textContent = 'Upload a JSON file: ';
    fileInputLabel.appendChild(input);

    appContainer.appendChild(fileInputLabel);

    function handleFile(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    displayApps(jsonData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);
        }
    }

    function displayApps(apps) {
        appContainer.innerHTML = ''; // Clear previous content

        apps.forEach(app => {
            const appDiv = document.createElement('div');
            appDiv.classList.add('app');

            const favicon = document.createElement('img');
            favicon.alt = 'Favicon';

            // Fetch favicon
            fetchFavicon(app.link)
                .then(faviconUrl => {
                    favicon.src = faviconUrl;
                })
                .catch(error => {
                    console.error('Error fetching favicon:', error);
                });

            const title = document.createElement('p');

            // Fetch title
            fetchTitle(app.link)
                .then(siteTitle => {
                    title.textContent = siteTitle;
                })
                .catch(error => {
                    console.error('Error fetching title:', error);
                });

            appDiv.appendChild(favicon);
            appDiv.appendChild(title);

            appContainer.appendChild(appDiv);
        });
    }

// Function to fetch the favicon
async function fetchFavicon(url) {
    try {
        const response = await fetch(`${url}/favicon.ico`, { mode: 'no-cors' });
        if (response.ok || response.type === 'opaque') {
            return `${url}/favicon.ico`;
        } else {
            throw new Error('Favicon not found');
        }
    } catch (error) {
        console.error('Error fetching favicon:', error);
        // Provide a default favicon URL when the requested favicon is not found
        return 'default-favicon-url';
    }
}


    // Function to fetch the title
    async function fetchTitle(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const match = text.match(/<title>(.*?)<\/title>/i);
            if (match && match[1]) {
                return match[1];
            } else {
                throw new Error('Title not found');
            }
        } catch (error) {
            console.error('Error fetching title:', error);
            // Provide a default title or handle the error as needed
            return 'Default Title';
        }
    }
});
