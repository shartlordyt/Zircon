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
            // Provide a default favicon URL or handle the error as needed
            return 'default-favicon-url';
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
                    // Provide a default favicon URL or handle the error as needed
                    favicon.src = 'default-favicon-url';
                });

            const title = document.createElement('a');
            title.href = app.link;
            title.target = '_blank'; // Open link in a new tab
            title.textContent = app.title || app.link;

            appDiv.appendChild(favicon);
            appDiv.appendChild(title);

            appContainer.appendChild(appDiv);
        });
    }
});
