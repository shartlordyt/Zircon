document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app-container');
    const sidebar = document.querySelector('.sidebar');

    // Ask the user to upload a JSON file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', handleFile);

    const fileInputLabel = document.createElement('label');
    fileInputLabel.textContent = 'Upload a JSON file: ';
    fileInputLabel.appendChild(input);

    sidebar.appendChild(fileInputLabel);

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
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', function () {
        input.click();
    });
    sidebar.appendChild(updateButton);

    // Input for pasting links
    const pasteInput = document.createElement('input');
    pasteInput.type = 'text';
    pasteInput.placeholder = 'Paste a link here...';
    sidebar.appendChild(pasteInput);

    // Button for adding links
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Link';
    addButton.addEventListener('click', function () {
        const link = pasteInput.value.trim();
        if (link !== '') {
            addApp({ link });
            pasteInput.value = '';
        }
    });
    sidebar.appendChild(addButton);

    // Button for clearing all data with double confirmation
    const clearAllButton = document.createElement('button');
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
    sidebar.appendChild(clearAllButton);

    // Button for exporting JSON
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export JSON';
    exportButton.addEventListener('click', exportToJson);
    sidebar.appendChild(exportButton);

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

    async function displayApps(apps) {
        appContainer.innerHTML = ''; // Clear previous content

        // Helper function to fetch title from URL
        async function fetchTitle(url) {
            try {
                const response = await fetch(url);
                const html = await response.text();
                const match = html.match(/<title.*?>(.*?)<\/title>/i);
                return match ? match[1] : url; // Return title or URL if title is not found
            } catch (error) {
                console.error('Error fetching title:', error);
                return url; // Return URL in case of an error
            }
        }

        // Display apps with dynamically fetched titles
        for (const app of apps) {
            const appLink = document.createElement('a');
            appLink.href = app.link;
            appLink.target = '_blank'; // Open link in a new tab

            const appDiv = document.createElement('div');
            appDiv.classList.add('app');

            // Display text content instead of favicon
            const title = document.createElement('p');
            title.textContent = await fetchTitle(app.link);

            appDiv.appendChild(title);

            appLink.appendChild(appDiv);
            appContainer.appendChild(appLink);
        }
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

