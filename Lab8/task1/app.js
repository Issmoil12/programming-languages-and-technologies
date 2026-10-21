const titleInput = document.querySelector("#bookTitle");
const authorInput = document.querySelector("#bookAuthor");
const addBtn = document.querySelector("#addBtn");
const bookList = document.querySelector("#bookList");

const STORAGE_KEY = "lab8_favorite_books";

// Безопасная загрузка данных из localStorage с обработкой ошибок JSON
let books = [];
try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const parsed = savedData ? JSON.parse(savedData) : [];
    books = Array.isArray(parsed) ? parsed : [];
} catch (error) {
    console.error("Ошибка при чтении из localStorage:", error);
    books = [];
}

// Функция сохранения данных и обновления интерфейса
function saveAndRender() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
        console.error("Ошибка при сохранении в localStorage:", error);
    }
    renderBooks();
}

// Функция отрисовки списка книг
function renderBooks() {
    bookList.replaceChildren(); // Очищаем текущий список

    if (books.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.textContent = "Список избранных книг пока пуст.";
        emptyMsg.style.justifyContent = "center";
        emptyMsg.style.color = "#95a5a6";
        bookList.append(emptyMsg);
        return;
    }

    books.forEach((book, index) => {
        const li = document.createElement("li");

        const infoDiv = document.createElement("div");
        infoDiv.className = "book-info";

        const titleSpan = document.createElement("span");
        titleSpan.className = "book-title";
        titleSpan.textContent = book.title;

        const authorSpan = document.createElement("span");
        authorSpan.className = "book-author";
        authorSpan.textContent = `Автор: ${book.author}`;

        infoDiv.append(titleSpan, authorSpan);

        // Кнопка удаления
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.addEventListener("click", () => {
            books.splice(index, 1);
            saveAndRender();
        });

        li.append(infoDiv, deleteBtn);
        bookList.append(li);
    });
}

// Обработчик события добавления книги
addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    // Проверка на пустой ввод
    if (!title || !author) {
        alert("Пожалуйста, заполните оба поля: название и автора!");
        return;
    }

    // Добавляем новую книгу в массив
    books.push({ title, author });

    // Очищаем поля ввода
    titleInput.value = "";
    authorInput.value = "";

    saveAndRender();
});

// Первичная отрисовка при загрузке страницы
renderBooks();