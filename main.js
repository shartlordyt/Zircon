document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app-container');
    const sidebar = document.querySelector('.sidebar');

    // Function to create a button
    function createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('button'); // Apply the button class
        button.addEventListener('click', clickHandler);
        return button;
    }

    // Function to handle file selection
    function handleFileSelection() {
        input.click();
    }

    // Create regular buttons
    const updateButton = createButton('Update', handleFileSelection);
    const addButton = createButton('Add Link', function () {
        const link = pasteInput.value.trim();
        if (link !== '') {
            addApp({ link });
            pasteInput.value = '';
        }
    });
    const clearAllButton = createButton('Clear All Data', function () {
        const confirmation1 = confirm('Are you sure you want to clear all data?');
        if (confirmation1) {
            const confirmation2 = confirm('This action is irreversible. Confirm once again to proceed.');
            if (confirmation2) {
                clearAllData();
            }
        }
    });
    const exportButton = createButton('Export JSON', exportToJson);

    // Create file select button
    const fileSelectButton = document.createElement('label');
    fileSelectButton.textContent = 'Upload a JSON file: ';
    fileSelectButton.classList.add('button'); // Apply the button class
    fileSelectButton.appendChild(input);

    // Append buttons to the sidebar
    sidebar.appendChild(updateButton);
    sidebar.appendChild(addButton);
    sidebar.appendChild(clearAllButton);
    sidebar.appendChild(exportButton);
    sidebar.appendChild(fileSelectButton);

    // ... (rest of your code)
});

