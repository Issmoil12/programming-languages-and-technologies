const events = [];
const participants = [];
let currentPage = "events";
let nextEventId = 1;
let nextParticipantId = 1;

const content = document.querySelector("#content");
const buttons = document.querySelectorAll("[data-page]");

function createElement(tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}

function createField(form, labelText, name, type = "text") {
    const label = createElement("label", labelText);
    label.htmlFor = name;

    const input = document.createElement("input");
    input.id = name;
    input.name = name;
    input.type = type;
    input.required = true;

    if (type === "text") {
        input.maxLength = 100;
    }

    if (type === "date") {
        input.min = new Date().toLocaleDateString("en-CA");
    }

    form.append(label, input);
    return input;
}

function showEvents() {
    content.replaceChildren();

    content.append(createElement("h2", "События"));

    const form = document.createElement("form");
    form.id = "eventForm";

    createField(form, "Название мероприятия", "eventName");
    createField(form, "Дата мероприятия", "eventDate", "date");
    createField(form, "Место проведения", "eventPlace");

    const submit = createElement("button", "Добавить мероприятие");
    submit.type = "submit";
    form.append(submit);

    const message = createElement("p", "", "message");
    content.append(form, message);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = form.elements.eventName.value.trim();
        const date = form.elements.eventDate.value;
        const place = form.elements.eventPlace.value.trim();

        if (!name || !date || !place) {
            message.textContent = "Заполните все поля.";
            message.className = "error";
            return;
        }

        if (date < new Date().toLocaleDateString("en-CA")) {
            message.textContent = "Дата не может быть в прошлом.";
            message.className = "error";
            return;
        }

        events.push({
            id: nextEventId++,
            name,
            date,
            place
        });

        showEvents();
    });

    if (events.length === 0) {
        content.append(createElement("p", "Пока мероприятий нет."));
    }

    events.forEach(item => {
        const card = createElement("article", "", "event-card");
        card.append(
            createElement("h3", item.name),
            createElement("p", `Дата: ${item.date}`),
            createElement("p", `Место: ${item.place}`)
        );

        const deleteButton = createElement("button", "Удалить");
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            const index = events.findIndex(event => event.id === item.id);
            if (index !== -1) events.splice(index, 1);

            for (let i = participants.length - 1; i >= 0; i--) {
                if (participants[i].eventId === item.id) {
                    participants.splice(i, 1);
                }
            }

            showEvents();
        });

        card.append(deleteButton);
        content.append(card);
    });
}

function showRegistration() {
    content.replaceChildren();
    content.append(createElement("h2", "Регистрация участника"));

    if (events.length === 0) {
        content.append(createElement(
            "p",
            "Сначала создайте мероприятие во вкладке «События»."
        ));
        return;
    }

    const form = document.createElement("form");
    form.id = "registrationForm";

    createField(form, "Имя участника", "participantName");
    createField(form, "Email", "participantEmail", "email");

    const label = createElement("label", "Мероприятие");
    label.htmlFor = "eventChoice";

    const select = document.createElement("select");
    select.id = "eventChoice";
    select.name = "eventChoice";
    select.required = true;

    events.forEach(item => {
        const option = document.createElement("option");
        option.value = String(item.id);
        option.textContent = `${item.name} — ${item.date}`;
        select.append(option);
    });

    form.append(label, select);

    const submit = createElement("button", "Зарегистрировать");
    submit.type = "submit";
    form.append(submit);

    const message = createElement("p", "", "message");
    content.append(form, message);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = form.elements.participantName.value.trim();
        const email = form.elements.participantEmail.value.trim();
        const eventId = Number(form.elements.eventChoice.value);

        if (!name || !email || !events.some(item => item.id === eventId)) {
            message.textContent = "Проверьте введённые данные.";
            message.className = "error";
            return;
        }

        const duplicate = participants.some(person =>
            person.eventId === eventId &&
            person.email.toLowerCase() === email.toLowerCase()
        );

        if (duplicate) {
            message.textContent =
                "Этот email уже зарегистрирован на данное мероприятие.";
            message.className = "error";
            return;
        }

        participants.push({
            id: nextParticipantId++,
            name,
            email,
            eventId
        });

        message.textContent = "Регистрация успешно завершена!";
        message.className = "message";
        form.reset();
    });
}

function showParticipants() {
    content.replaceChildren();
    content.append(createElement("h2", "Участники"));

    content.append(createElement(
        "p",
        `Всего участников: ${participants.length}`
    ));

    if (participants.length === 0) {
        content.append(createElement("p", "Участников пока нет."));
        return;
    }

    participants.forEach(person => {
        const event = events.find(item => item.id === person.eventId);
        const card = createElement("article", "", "participant-card");

        card.append(
            createElement("h3", person.name),
            createElement("p", `Email: ${person.email}`),
            createElement(
                "p",
                `Мероприятие: ${event ? event.name : "Не найдено"}`
            )
        );

        const deleteButton = createElement("button", "Удалить участника");
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            const index = participants.findIndex(
                item => item.id === person.id
            );

            if (index !== -1) participants.splice(index, 1);
            showParticipants();
        });

        card.append(deleteButton);
        content.append(card);
    });
}

function renderPage() {
    buttons.forEach(button => {
        const active = button.dataset.page === currentPage;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    if (currentPage === "events") showEvents();
    if (currentPage === "registration") showRegistration();
    if (currentPage === "participants") showParticipants();
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        currentPage = button.dataset.page;
        renderPage();
    });
});

renderPage();