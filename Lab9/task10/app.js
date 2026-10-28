
const loadUsersButton = document.querySelector('#loadUsersButton');
const status = document.querySelector('#status');
const usersList = document.querySelector('#usersList');

async function loadUsers() {
    loadUsersButton.disabled = true;
    status.textContent = 'Загрузка пользователей...';
    usersList.replaceChildren();

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
            const card = document.createElement('article');
            card.className = 'user-card';

            const name = document.createElement('h2');
            name.textContent = user.name;

            const email = document.createElement('p');
            email.textContent = `Email: ${user.email}`;

            const company = document.createElement('p');
            company.textContent = `Компания: ${user.company.name}`;

            const postsButton = document.createElement('button');
            postsButton.textContent = 'Показать публикации';

            const postsContainer = document.createElement('div');
            postsContainer.className = 'posts';
            postsContainer.hidden = true;

            postsButton.addEventListener('click', async () => {
                if (!postsContainer.hidden) {
                    postsContainer.hidden = true;
                    postsButton.textContent = 'Показать публикации';
                    return;
                }

                postsContainer.hidden = false;
                postsContainer.replaceChildren();

                const loading = document.createElement('p');
                loading.textContent = 'Загрузка публикаций...';
                postsContainer.append(loading);

                postsButton.disabled = true;

                try {
                    const postsResponse = await fetch(
                        `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
                    );

                    if (!postsResponse.ok) {
                        throw new Error(
                            `Ошибка HTTP: ${postsResponse.status}`
                        );
                    }

                    const posts = await postsResponse.json();
                    postsContainer.replaceChildren();

                    if (posts.length === 0) {
                        const message = document.createElement('p');
                        message.textContent = 'Публикации не найдены.';
                        postsContainer.append(message);
                    } else {
                        const heading = document.createElement('h3');
                        heading.textContent = `Публикации (${posts.length})`;
                        postsContainer.append(heading);

                        for (const post of posts) {
                            const postItem = document.createElement('article');
                            postItem.className = 'post-item';

                            const postTitle = document.createElement('h4');
                            postTitle.textContent = post.title;

                            const postBody = document.createElement('p');
                            postBody.textContent = post.body;

                            postItem.append(postTitle, postBody);
                            postsContainer.append(postItem);
                        }
                    }

                    postsButton.textContent = 'Скрыть публикации';
                } catch (error) {
                    postsContainer.replaceChildren();

                    const errorMessage = document.createElement('p');
                    errorMessage.textContent =
                        `Ошибка загрузки публикаций: ${error.message}`;

                    postsContainer.append(errorMessage);
                    postsButton.textContent = 'Повторить загрузку';
                } finally {
                    postsButton.disabled = false;
                }
            });

            card.append(name, email, company, postsButton, postsContainer);
            usersList.append(card);
        }

        status.textContent = `Успешно загружено пользователей: ${users.length}`;
    } catch (error) {
        status.textContent = `Ошибка загрузки: ${error.message}`;
    } finally {
        loadUsersButton.disabled = false;
    }
}

loadUsersButton.addEventListener('click', loadUsers);
