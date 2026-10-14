const tasks = [];
let currentPage = "all";
let nextId = 1;

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCounter = document.querySelector("#taskCounter");
const emptyMessage = document.querySelector("#emptyMessage");
const sectionTitle = document.querySelector("#sectionTitle");
const buttons = document.querySelectorAll("[data-page]");

const titles = {
    all: "Все задачи",
    active: "Активные задачи",
    completed: "Выполненные задачи"
};

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentPage === "active") return !task.completed;
        if (currentPage === "completed") return task.completed;
        return true;
    });

    sectionTitle.textContent = titles[currentPage];
    taskCounter.textContent =
        `Всего: ${tasks.length} | Выполнено: ${
            tasks.filter(task => task.completed).length
        }`;

    emptyMessage.hidden = filteredTasks.length > 0;
    emptyMessage.textContent = tasks.length === 0
        ? "Задач пока нет. Добавьте первую задачу!"
        : "В этом разделе задач нет.";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("done");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Отметить выполнение");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const text = document.createElement("span");
        text.textContent = task.title;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Удалить";

        deleteButton.addEventListener("click", () => {
            const index = tasks.findIndex(item => item.id === task.id);
            if (index !== -1) tasks.splice(index, 1);
            renderTasks();
        });

        li.append(checkbox, text, deleteButton);
        taskList.append(li);
    });

    buttons.forEach(button => {
        const active = button.dataset.page === currentPage;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskInput.value.trim();
    if (!title) {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: nextId++,
        title: title,
        completed: false
    });

    taskInput.value = "";
    currentPage = "all";
    renderTasks();
    taskInput.focus();
});

buttons.forEach(button => {
    button.addEventListener("click", () => {
        currentPage = button.dataset.page;
        renderTasks();
    });
});

renderTasks();