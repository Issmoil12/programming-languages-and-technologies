
const loadButton = document.querySelector('#loadButton');
const status = document.querySelector('#status');
const userList = document.querySelector('#userList');

async function loadUsers() {
    loadButton.disabled = true;
    status.textContent = 'Загрузка пользователей...';
    userList.replaceChildren();

    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/users'
        );

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const users = await response.json();

        if (users.length === 0) {
            status.textContent = 'Пользователи не найдены.';
            return;
        }

        for (const user of users) {
            const item = document.createElement('li');
            item.className = 'user-card';

            const name = document.createElement('strong');
            name.textContent = user.name;

            const email = document.createElement('p');
            email.textContent = `Email: ${user.email}`;

            item.append(name, email);
            userList.append(item);
        }

        status.textContent =
            `Успешно загружено пользователей: ${users.length}`;
    } catch (error) {
        status.textContent = `Ошибка загрузки: ${error.message}`;
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener('click', loadUsers);
