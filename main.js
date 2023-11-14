document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app-container');
    const updateButton = document.createElement('button');
    const input = document.createElement('input');

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

            // Show the update button after the list is loaded
            updateButton.textContent = 'Update';
            appContainer.appendChild(updateButton);
        } catch (error) {
            console.error('Error parsing stored JSON data:', error);
        }
    }

    // Button for updating JSON data
    updateButton.addEventListener('click', function () {
        input.click();
    });

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

                    // Show the update button after the list is loaded
                    updateButton.textContent = 'Update';
                    appContainer.appendChild(updateButton);
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
            const appLink = document.createElement('a');
            appLink.href = app.link;
            appLink.target = '_blank'; // Open link in a new tab

            const appDiv = document.createElement('div');
            appDiv.classList.add('app');

            // Display text content instead of favicon
            const title = document.createElement('p');
            title.textContent = app.title || app.link;

            appDiv.appendChild(title);

            appLink.appendChild(appDiv);
            appContainer.appendChild(appLink);
        });
    }
});
