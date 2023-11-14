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
            favicon.src = app.favicon;
            favicon.alt = 'Favicon';

            const title = document.createElement('p');
            title.textContent = app.title;

            appDiv.appendChild(favicon);
            appDiv.appendChild(title);

            appContainer.appendChild(appDiv);
        });
    }
});
