document.addEventListener('DOMContentLoaded', async function () {
    const createForm = document.getElementById('createForm');
    createForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const calories = document.getElementById('calories').value;
        createItem(type, description, calories);
        createForm.reset();
    });
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function () {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        searchItems(searchTerm);
    });
    function createItem(type, description, calories) {
        const item = {
            type: type,
            description: description,
            calories: calories || '',
            id: Date.now() // Simple unique ID based on timestamp
        };
        const items = JSON.parse(localStorage.getItem('healthItems')) || [];
        items.push(item);
        localStorage.setItem('healthItems', JSON.stringify(items));
        displayItems();
    }
    function displayItems() {
        const itemsContainer = document.getElementById('itemsContainer');
        itemsContainer.innerHTML = '';
        const items = JSON.parse(localStorage.getItem('healthItems')) || [];
        items.forEach(function (item) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.dataset.id = item.id;
            const typeText = `<strong>Type:</strong> ${item.type}`;
            const descriptionText = `<p><strong>Description:</strong> ${item.description}</p>`;
            const caloriesText = item.calories ? `<p><strong>Calories:</strong> ${item.calories}</p>` : '';
            const editButton = `<button class="editButton" data-id="${item.id}">Edit</button>`;
            const deleteButton = `<button class="deleteButton" data-id="${item.id}">Delete</button>`;
            itemDiv.innerHTML = `${typeText} ${descriptionText} ${caloriesText} ${editButton} ${deleteButton}`;
            itemsContainer.appendChild(itemDiv);
        });
        addEditDeleteListeners();
    }
    function editItem(id, updatedType, updatedDescription, updatedCalories) {
        const items = JSON.parse(localStorage.getItem('healthItems')) || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index].type = updatedType;
            items[index].description = updatedDescription;
            items[index].calories = updatedCalories;
            localStorage.setItem('healthItems', JSON.stringify(items));
            displayItems();
        }
    }
    function deleteItem(id) {
        const items = JSON.parse(localStorage.getItem('healthItems')) || [];
        const updatedItems = items.filter(item => item.id !== id);
        localStorage.setItem('healthItems', JSON.stringify(updatedItems));
        displayItems();
    }
    function addEditDeleteListeners() {
        const editButtons = document.querySelectorAll('.editButton');
        const deleteButtons = document.querySelectorAll('.deleteButton');
        editButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = parseInt(button.dataset.id);
                const itemToEdit = JSON.parse(localStorage.getItem('healthItems')).find(item => item.id === id);
                // You can show a form or prompt to get updated details and call editItem function
                const updatedType = prompt('Update Type', itemToEdit.type);
                const updatedDescription = prompt('Update Description', itemToEdit.description);
                const updatedCalories = prompt('Update Calories (leave blank if not applicable)', itemToEdit.calories);
                editItem(id, updatedType, updatedDescription, updatedCalories);
            });
        });
        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = parseInt(button.dataset.id);
                deleteItem(id);
            });
        });
    }
    function searchItems(searchTerm) {
        const items = JSON.parse(localStorage.getItem('healthItems')) || [];
        const filteredItems = items.filter(item => item.description.toLowerCase().includes(searchTerm) || item.type.toLowerCase().includes(searchTerm));
        const itemsContainer = document.getElementById('itemsContainer');
        itemsContainer.innerHTML = '';
        filteredItems.forEach(function (item) {
            // Similar code as in displayItems to create and append item divs
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.dataset.id = item.id;
            const typeText = `<strong>Type:</strong> ${item.type}`;
            const descriptionText = `<p><strong>Description:</strong> ${item.description}</p>`;
            const caloriesText = item.calories ? `<p><strong>Calories:</strong> ${item.calories}</p>` : '';
            const editButton = `<button class="editButton" data-id="${item.id}">Edit</button>`;
            const deleteButton = `<button class="deleteButton" data-id="${item.id}">Delete</button>`;
            itemDiv.innerHTML = `${typeText} ${descriptionText} ${caloriesText} ${editButton} ${deleteButton}`;
            itemsContainer.appendChild(itemDiv);
        });
        addEditDeleteListeners();
    }


    // weather api//
    // DOM elements
    const addWeatherBtn = document.getElementById('get-weather-btn');
    const announcement = document.getElementById('announcement');

    // Button to start fetching weather information
    addWeatherBtn.addEventListener('click', getWeatherInfo);

    // Function to fetch weather info and manipulate DOM
    // element ,announcement, for user to see
    function getWeatherInfo() {
        announcement.innerHTML = '';
        console.log("ran line 120")

        let promise = getWeatherForecast(); // Calling async API GET function 
        promise.then(resolve, reject); // Begin processing only after data are ready
        function resolve(json) {
            const records = json.data.records[0];
            const general = json.data.records[0].general;
            const date = records.date.split('-');
            const lowTemp = general.temperature.low;
            const highTemp = general.temperature.high;
            const forecast = general.forecast.text;
            const timestamp = records.updatedTimestamp.substring(11, 19);

            announcement.innerHTML = `<td>${forecast}<br/><br/></td>`;
            announcement.innerHTML += `<td>Date </td><td>${date[2]}-${date[1]}-${date[0]} <br/></td>`
            announcement.innerHTML += `<td>Low </td><td>${lowTemp} C<br/></td>`;
            announcement.innerHTML += `<td>High </td><td>${highTemp} C<br/><br/></td>`;
            announcement.innerHTML += `<td>Updated at </td><td>${timestamp}<br/></td>`;

        }
        // Reject get called if the is an issue in the API call
        function reject(reason) {
            console.log("Couldn't get the records! Reason: " + reason);
        }
    }

    // async API GET function specific URL
    async function getWeatherForecast() {
        const url = 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast';

        // When an error encountered, system will log it under error.
        try {
            const response = await fetch(url);
            const data = await response.json();
            return await data;
        } catch (error) {
            console.error(error);
        }
    }
});

