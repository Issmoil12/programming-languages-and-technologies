// Данные для каждой вкладки
const pages = {
    about: {
        title: "О себе",
        text: "Привет! Я студент, изучающий языки и технологии программирования.",
        details: "Это моё первое SPA-приложение, созданное с помощью HTML, CSS и JavaScript."
    },

    skills: {
        title: "Навыки",
        text: "Я изучаю современные веб-технологии.",
        details: "Мои навыки: HTML5, CSS3, JavaScript и работа с GitHub."
    },

    contacts: {
        title: "Контакты",
        text: "Здесь находится контактная информация.",
        details: "Email: student@example.com"
    }
};

// Находим элементы страницы
const content = document.querySelector("#content");
const buttons = document.querySelectorAll("[data-page]");

// Функция отображения выбранной вкладки
function showPage(pageName) {
    const page = pages[pageName];

    // Проверяем, существует ли такая страница
    if (!page) {
        content.textContent = "Ошибка: страница не найдена.";
        return;
    }

    // Очищаем область содержимого
    content.replaceChildren();

    // Создаём заголовок
    const title = document.createElement("h2");
    title.textContent = page.title;

    // Создаём основной текст
    const paragraph = document.createElement("p");
    paragraph.textContent = page.text;

    // Создаём дополнительный текст
    const details = document.createElement("p");
    details.textContent = page.details;

    // Добавляем элементы на страницу
    content.append(title, paragraph, details);

    // Выделяем активную вкладку
    buttons.forEach(button => {
        const isActive = button.dataset.page === pageName;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-current", isActive ? "page" : "false");
    });
}

// Обрабатываем клики по вкладкам
buttons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// Показываем стартовую вкладку
showPage("about");