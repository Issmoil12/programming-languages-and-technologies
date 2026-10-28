
const loadUsersButton = document.querySelector('#loadUsersButton');
const userSelect = document.querySelector('#userSelect');
const status = document.querySelector('#status');
const userInfo = document.querySelector('#userInfo');
const postsSection = document.querySelector('#postsSection');
const postsList = document.querySelector('#postsList');

async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();
}

function createMessage(message) {
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    return paragraph;
}

async function loadUsers() {
    loadUsersButton.disabled = true;
    userSelect.disabled = true;
    status.textContent = 'Загрузка пользователей...';

    userInfo.hidden = true;
    postsSection.hidden = true;
    userInfo.replaceChildren();
    postsList.replaceChildren();

    try {
        const users = await fetchData(
            'https://jsonplaceholder.typicode.com/users'
        );

        userSelect.replaceChildren();

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите пользователя';
        userSelect.append(defaultOption);

        for (const user of users) {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelect.append(option);
        }

        userSelect.disabled = false;
        status.textContent =
            `Пользователи загружены: ${users.length}. Выберите пользователя.`;
    } catch (error) {
        status.textContent =
            `Ошибка загрузки пользователей: ${error.message}`;

        const retryButton = document.createElement('button');
        retryButton.textContent = 'Повторить загрузку';
        retryButton.addEventListener('click', loadUsers);
        status.append(document.createTextNode(' '), retryButton);
    } finally {
        loadUsersButton.disabled = false;
    }
}

async function loadUserPosts(userId) {
    status.textContent = 'Загрузка пользователя и публикаций...';
    userInfo.hidden = true;
    postsSection.hidden = true;
    userInfo.replaceChildren();
    postsList.replaceChildren();

    try {
        const user = await fetchData(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );

        if (!user || !user.id) {
            throw new Error('Пользователь не найден.');
        }

        const posts = await fetchData(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );

        const heading = document.createElement('h2');
        heading.textContent = user.name;

        const email = document.createElement('p');
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement('p');
        city.textContent = `Город: ${user.address.city}`;

        const company = document.createElement('p');
        company.textContent = `Компания: ${user.company.name}`;

        userInfo.append(heading, email, city, company);
        userInfo.hidden = false;

        postsSection.hidden = false;

        if (posts.length === 0) {
            postsList.append(createMessage('Публикации не найдены.'));
        }

        for (const post of posts) {
            const card = document.createElement('article');
            card.className = 'post-card';

            const title = document.createElement('h3');
            title.textContent = post.title;

            const body = document.createElement('p');
            body.textContent = post.body;

            const commentsButton = document.createElement('button');
            commentsButton.className = 'comments-button';
            commentsButton.textContent = 'Показать комментарии';

            const commentsContainer = document.createElement('div');
            commentsContainer.className = 'comments';
            commentsContainer.hidden = true;

            commentsButton.addEventListener('click', async () => {
                if (!commentsContainer.hidden) {
                    commentsContainer.hidden = true;
                    commentsButton.textContent = 'Показать комментарии';
                    return;
                }

                commentsContainer.hidden = false;
                commentsContainer.replaceChildren();
                commentsButton.disabled = true;
                commentsButton.textContent = 'Загрузка...';

                commentsContainer.append(
                    createMessage('Загрузка комментариев...')
                );

                try {
                    const comments = await fetchData(
                        `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
                    );

                    commentsContainer.replaceChildren();

                    const commentsHeading = document.createElement('h4');
                    commentsHeading.textContent =
                        `Комментарии (${comments.length})`;
                    commentsContainer.append(commentsHeading);

                    if (comments.length === 0) {
                        commentsContainer.append(
                            createMessage('Комментариев пока нет.')
                        );
                    }

                    for (const comment of comments) {
                        const commentCard = document.createElement('div');
                        commentCard.className = 'comment';

                        const author = document.createElement('strong');
                        author.textContent = comment.name;

                        const email = document.createElement('p');
                        email.className = 'comment-email';
                        email.textContent = comment.email;

                        const text = document.createElement('p');
                        text.textContent = comment.body;

                        commentCard.append(author, email, text);
                        commentsContainer.append(commentCard);
                    }

                    commentsButton.textContent = 'Скрыть комментарии';
                } catch (error) {
                    commentsContainer.replaceChildren();

                    commentsContainer.append(
                        createMessage(
                            `Ошибка загрузки комментариев: ${error.message}`
                        )
                    );

                    commentsButton.textContent = 'Повторить загрузку комментариев';
                } finally {
                    commentsButton.disabled = false;
                }
            });

            card.append(title, body, commentsButton, commentsContainer);
            postsList.append(card);
        }

        status.textContent =
            `Успешно загружены данные пользователя и публикации: ${posts.length}.`;
    } catch (error) {
        status.textContent = `Ошибка загрузки данных: ${error.message}`;

        const retryButton = document.createElement('button');
        retryButton.textContent = 'Повторить загрузку';
        retryButton.addEventListener('click', () => loadUserPosts(userId));
        status.append(document.createTextNode(' '), retryButton);
    }
}

userSelect.addEventListener('change', () => {
    if (userSelect.value) {
        loadUserPosts(userSelect.value);
    } else {
        userInfo.hidden = true;
        postsSection.hidden = true;
        userInfo.replaceChildren();
        postsList.replaceChildren();
        status.textContent = 'Выберите пользователя.';
    }
});

loadUsersButton.addEventListener('click', loadUsers);
