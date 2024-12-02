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
        const caloriesText = item.calories? `<p><strong>Calories:</strong> ${item.calories}</p>` : '';
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
    if (index!== -1) {
        items[index].type = updatedType;
        items[index].description = updatedDescription;
        items[index].calories = updatedCalories;
        localStorage.setItem('healthItems', JSON.stringify(items));
        displayItems();
    }
}
function deleteItem(id) {
    const items = JSON.parse(localStorage.getItem('healthItems')) || [];
    const updatedItems = items.filter(item => item.id!== id);
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
        const caloriesText = item.calories? `<p><strong>Calories:</strong> ${item.calories}</p>` : '';
        const editButton = `<button class="editButton" data-id="${item.id}">Edit</button>`;
        const deleteButton = `<button class="deleteButton" data-id="${item.id}">Delete</button>`;
        itemDiv.innerHTML = `${typeText} ${descriptionText} ${caloriesText} ${editButton} ${deleteButton}`;
        itemsContainer.appendChild(itemDiv);
    });
    addEditDeleteListeners();
}