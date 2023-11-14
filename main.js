document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app-container');
    const updateButton = document.createElement('button');
    const input = document.createElement('input');
    const pasteInput = document.createElement('input');
    const addButton = document.createElement('button');
    const clearAllButton = document.createElement('button');
    const exportButton = document.createElement('button');

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

    // Button for updating JSON data
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', function () {
        input.click();
    });

    // Input for pasting links
    pasteInput.type = 'text';
    pasteInput.placeholder = 'Paste a link here...';

    // Button for adding links
    addButton.textContent = 'Add Link';
    addButton.addEventListener('click', function () {
        const link = pasteInput.value.trim();
        if (link !== '') {
            addApp({ link });
            pasteInput.value = '';
        }
    });

    // Button for clearing all data with double confirmation
    clearAllButton.textContent = 'Clear All Data';
    clearAllButton.addEventListener('click', function () {
        const confirmation1 = confirm('Are you sure you want to clear all data?');
        if (confirmation1) {
            const confirmation2 = confirm('This action is irreversible. Confirm once again to proceed.');
            if (confirmation2) {
                clearAllData();
            }
        }
    });

    // Button for exporting JSON
    exportButton.textContent = 'Export JSON';
    exportButton.addEventListener('click', exportToJson);

    // Append buttons and input to the page
    appContainer.appendChild(updateButton);
    appContainer.appendChild(pasteInput);
    appContainer.appendChild(addButton);
    appContainer.appendChild(clearAllButton);
    appContainer.appendChild(exportButton);

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

    function addApp(app) {
        const storedData = localStorage.getItem('appData');
        let jsonData = storedData ? JSON.parse(storedData) : [];
        jsonData.push(app);

        // Save data to local storage
        localStorage.setItem('appData', JSON.stringify(jsonData));

        displayApps(jsonData);
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
            title.textContent = app.title || app.link; // Use link if title is not available

            appDiv.appendChild(title);

            appLink.appendChild(appDiv);
            appContainer.appendChild(appLink);
        });
    }

    function clearAllData() {
        // Clear data from local storage
        localStorage.removeItem('appData');
        appContainer.innerHTML = ''; // Clear content on the page
    }

    function exportToJson() {
        const storedData = localStorage.getItem('appData');
        if (storedData) {
            const jsonData = JSON.parse(storedData);

            // Create a blob with the JSON data
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });

            // Create a download link and trigger a click to download the JSON file
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'exported_apps.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('No data to export.');
        }
    }
});
