const itemInput = document.querySelector("#itemInput");
const addButton = document.querySelector("#addButton");
const shoppingList = document.querySelector("#shoppingList");
const clearButton = document.querySelector("#clearButton");
const counter = document.querySelector("#counter");
const message = document.querySelector("#message");

let items = [];

// Функция обновления счетчика
function updateCounter() {
    counter.textContent = `Всего товаров: ${items.length}`;
}

// Функция отображения списка
function renderList() {
    shoppingList.innerHTML = "";

    for (let i = 0; i < items.length; i++) {
        const listItem = document.createElement("li");

        const itemText = document.createElement("span");
        itemText.textContent = `${i + 1}. ${items[i]}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", function () {
            items.splice(i, 1);
            renderList();
            updateCounter();
        });

        listItem.appendChild(itemText);
        listItem.appendChild(deleteButton);

        shoppingList.appendChild(listItem);
    }

    updateCounter();
}

// Функция добавления товара
function addItem() {
    const itemName = itemInput.value.trim();

    if (itemName === "") {
        message.textContent = "Введите название товара";
        return;
    }

    if (items.includes(itemName)) {
        message.textContent = "Такой товар уже есть в списке";
        return;
    }

    items.push(itemName);

    itemInput.value = "";
    message.textContent = "";

    renderList();
}

// Обработка кнопки "Добавить"
addButton.addEventListener("click", addItem);

// Добавление товара клавишей Enter
itemInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
});

// Очистка всего списка
clearButton.addEventListener("click", function () {
    if (items.length === 0) {
        message.textContent = "Список уже пуст";
        return;
    }

    items = [];
    renderList();
    message.textContent = "Список очищен";
});
