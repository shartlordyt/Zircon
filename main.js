document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app-container');
    const updateButton = document.getElementById('update-button');
    const input = document.createElement('input');
    
    // Button for updating JSON data
    updateButton.addEventListener('click', function () {
        input.click();
    });

    // Ask the user to upload a JSON file
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', handleFile);

    const fileInputLabel = document.createElement('label');
    fileInputLabel.textContent = 'Upload a JSON file: ';
    fileInputLabel.appendChild(input);

    appContainer.appendChild(fileInputLabel);

    // Load data from local storage
    const storedData = localStorage.getItem('appData');
    if (storedData) {
        try {
            const jsonData = JSON.parse(storedData);
            displayApps(jsonData);
        } catch (error) {
            console.error('Error parsing stored JSON data:', error);
        }
    }

    function handleFile(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    displayApps(jsonData);

                    // Save data to local storage
                    localStorage.setItem('appData', JSON.stringify(jsonData));
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
            return 'default-favicon-url.png';
        }
    }

    function displayApps(apps) {
        appContainer.innerHTML = ''; // Clear previous content

        apps.forEach(app => {
            const appLink = document.createElement('a');
            appLink.href = app.link;
            appLink.target = '_blank'; // Open link in a new tab

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
                    favicon.src = 'default-favicon-url.png';
                });

            const title = document.createElement('p');
            title.textContent = app.title || app.link;

            appDiv.appendChild(favicon);
            appDiv.appendChild(title);

            appLink.appendChild(appDiv);
            appContainer.appendChild(appLink);
        });
    }
});
