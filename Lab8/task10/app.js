const titleInput = document.querySelector("#movieTitle");
const genreInput = document.querySelector("#movieGenre");
const ratingInput = document.querySelector("#movieRating");
const addBtn = document.querySelector("#addBtn");
const movieList = document.querySelector("#movieList");
const genreFilter = document.querySelector("#genreFilter");

const STORAGE_KEY = "lab8_movie_catalog";

// Загрузка данных из localStorage с защитой от ошибок
let movies = [];
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    movies = Array.isArray(parsed) ? parsed : [];
} catch (error) {
    console.error("Ошибка чтения JSON из localStorage:", error);
    movies = [];
}

// Главная функция сохранения и обновления экрана
function saveAndRender() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch (error) {
        console.error("Ошибка сохранения в localStorage:", error);
    }
    updateFilterOptions();
    renderMovies();
}

// Обновление списка жанров в выпадающем списке фильтра
function updateFilterOptions() {
    const currentFilter = genreFilter.value;
    
    // Собираем уникальные жанры (приводим к нижнему регистру для красоты, но выводим как есть)
    const genres = [...new Set(movies.map(m => m.genre.trim()))];

    // Очищаем селект, оставляя дефолтный пункт
    genreFilter.innerHTML = '<option value="all">Все жанры</option>';

    genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreFilter.append(option);
    });

    // Возвращаем ранее выбранный фильтр, если он еще существует
    genreFilter.value = genres.includes(currentFilter) ? currentFilter : "all";
}

// Отрисовка списка с учетом фильтра
function renderMovies() {
    movieList.replaceChildren();

    const selectedGenre = genreFilter.value;
    
    // Фильтрация массива
    const filteredMovies = movies.filter(movie => {
        if (selectedGenre === "all") return true;
        return movie.genre.trim().toLowerCase() === selectedGenre.toLowerCase();
    });

    if (filteredMovies.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.textContent = "Список фильмов пуст или ничего не найдено.";
        emptyMsg.style.justifyContent = "center";
        emptyMsg.style.color = "#95a5a6";
        movieList.append(emptyMsg);
        return;
    }

    filteredMovies.forEach((movie) => {
        // Находим реальный индекс в исходном массиве (чтобы удалять верно)
        const originalIndex = movies.findIndex(m => m === movie);

        const li = document.createElement("li");

        const infoDiv = document.createElement("div");
        infoDiv.className = "movie-info";

        const titleSpan = document.createElement("span");
        titleSpan.className = "movie-title";
        titleSpan.textContent = movie.title;

        const detailsSpan = document.createElement("span");
        detailsSpan.className = "movie-details";
        detailsSpan.textContent = `Жанр: `;
        
        const genreBadge = document.createElement("span");
        genreBadge.className = "movie-badge";
        genreBadge.textContent = movie.genre;

        detailsSpan.append(genreBadge);
        detailsSpan.append(` | Рейтинг: ⭐ ${movie.rating}`);

        infoDiv.append(titleSpan, detailsSpan);

        // Кнопка удаления
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.addEventListener("click", () => {
            movies.splice(originalIndex, 1);
            saveAndRender();
        });

        li.append(infoDiv, deleteBtn);
        movieList.append(li);
    });
}

// Событие добавления фильма
addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const genre = genreInput.value.trim();
    const rating = ratingInput.value.trim();

    if (!title || !genre || !rating) {
        alert("Пожалуйста, заполните все поля (название, жанр, рейтинг)!");
        return;
    }

    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 10) {
        alert("Рейтинг должен быть числом от 1 до 10!");
        return;
    }

    movies.push({ title, genre, rating: numRating });

    // Очистка полей ввода
    titleInput.value = "";
    genreInput.value = "";
    ratingInput.value = "";

    saveAndRender();
});

// Событие изменения фильтра
genreFilter.addEventListener("change", () => {
    renderMovies();
});

// Первичный запуск при открытии страницы
updateFilterOptions();
renderMovies();