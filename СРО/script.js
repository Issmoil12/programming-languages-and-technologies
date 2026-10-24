// Данные курсов
const coursesData = [
    { id: 1, name: "Языки и технология программирования", teacher: "Масимова З.", grade: 92, status: "A" },
    { id: 2, name: "Базы данных (MySQL)", teacher: "Иванова А.", grade: 88, status: "B+" },
    { id: 3, name: "Высшая математика", teacher: "Сарсенов Б.", grade: 81, status: "B" },
    { id: 4, name: "Философия", teacher: "Кенжебаев Н.", grade: 95, status: "A" }
];

// Расписание
const scheduleData = [
    { time: "09:00 - 10:20", mon: "Языки программирования (Лек)", tue: "—", wed: "Базы данных (Лаб)", thu: "—", fri: "Высшая математика" },
    { time: "10:30 - 11:50", mon: "—", tue: "Философия (Лек)", wed: "—", thu: "Языки программирования (Прак)", fri: "—" },
    { time: "12:10 - 13:30", mon: "Базы данных (Лек)", tue: "—", wed: "Высшая математика", thu: "—", fri: "Философия (Прак)" }
];

// СРО задания (хранение)
let sroTasks = JSON.parse(localStorage.getItem('hero_sro_tasks')) || [
    { id: 1, title: "СРО №1. Разработка планировщика", course: "Языки и технология программирования", deadline: "2026-10-28", status: "Сдано" },
    { id: 2, title: "СРО №2. Нормализация БД и ERD", course: "Базы данных", deadline: "2026-11-02", status: "В работе" }
];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderCourses();
    renderUpcomingClasses();
    renderSchedule();
    renderSROList();
    renderGradesAndCalc();
    updatePendingCount();
});

// Переключение вкладок
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTitle = document.getElementById('tabTitle');

    const titlesMap = {
        'dashboard': 'Дашборд студента',
        'schedule': 'Расписание занятий',
        'tasks': 'Управление СРО и заданиями',
        'grades': 'Успеваемость и Калькулятор GPA'
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-filter') || btn.getAttribute('data-tab');

            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            tabTitle.textContent = titlesMap[targetTab] || 'HeRo Study Space';
        });
    });
}

// Отображение курсов
function renderCourses() {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = coursesData.map(c => `
        <div class="course-item">
            <div>
                <strong style="font-size: 14px;">${c.name}</strong>
                <p style="font-size: 12px; color: var(--text-muted);">${c.teacher}</p>
            </div>
            <div style="text-align: right;">
                <span style="font-weight: bold; color: var(--accent);">${c.grade} баллов (${c.status})</span>
                <div class="progress-bar-bg" style="margin-top: 4px;">
                    <div class="progress-bar-fill" style="width: ${c.grade}%;"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// Ближайшие пары
function renderUpcomingClasses() {
    const container = document.getElementById('upcomingContainer');
    container.innerHTML = `
        <div class="upcoming-item">
            <div>
                <strong>Языки и технология программирования</strong>
                <p style="font-size: 12px; color: var(--text-muted);">Кабинет 402 • 09:00 - 10:20</p>
            </div>
            <span style="font-size: 12px; background: rgba(79, 70, 229, 0.2); color: var(--primary); padding: 4px 8px; border-radius: 6px;">Сегодня</span>
        </div>
        <div class="upcoming-item">
            <div>
                <strong>Базы данных (Лабораторная)</strong>
                <p style="font-size: 12px; color: var(--text-muted);">Кабинет 308 • 12:10 - 13:30</p>
            </div>
            <span style="font-size: 12px; background: rgba(255,255,255,0.05); color: var(--text-muted); padding: 4px 8px; border-radius: 6px;">Завтра</span>
        </div>
    `;
}

// Расписание
function renderSchedule() {
    const body = document.getElementById('scheduleBody');
    body.innerHTML = scheduleData.map(s => `
        <tr>
            <td><strong>${s.time}</strong></td>
            <td>${s.mon}</td>
            <td>${s.tue}</td>
            <td>${s.wed}</td>
            <td>${s.thu}</td>
            <td>${s.fri}</td>
        </tr>
    `).join('');
}

// Управление СРО
const sroForm = document.getElementById('sroForm');
sroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('sroTitle').value.trim();
    const course = document.getElementById('sroCourse').value;
    const deadline = document.getElementById('sroDeadline').value;

    const newTask = {
        id: Date.now(),
        title,
        course,
        deadline,
        status: "В работе"
    };

    sroTasks.unshift(newTask);
    localStorage.setItem('hero_sro_tasks', JSON.stringify(sroTasks));
    renderSROList();
    updatePendingCount();
    sroForm.reset();
});

function renderSROList() {
    const container = document.getElementById('sroList');
    if (sroTasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Нет СРО</p>';
        return;
    }

    container.innerHTML = sroTasks.map(task => `
        <div class="sro-card">
            <div>
                <strong style="font-size: 14px;">${escapeHtml(task.title)}</strong>
                <p style="font-size: 12px; color: var(--text-muted);">${task.course} | Срок: ${task.deadline}</p>
            </div>
            <button class="sro-status-btn" onclick="toggleSROStatus(${task.id})">${task.status}</button>
        </div>
    `).join('');
}

function toggleSROStatus(id) {
    const task = sroTasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === "В работе" ? "Сдано" : "В работе";
        localStorage.setItem('hero_sro_tasks', JSON.stringify(sroTasks));
        renderSROList();
        updatePendingCount();
    }
}

function updatePendingCount() {
    const count = sroTasks.filter(t => t.status === "В работе").length;
    document.getElementById('pendingTasksCount').textContent = count;
}

// Оценки и GPA Калькулятор
function renderGradesAndCalc() {
    const gradesList = document.getElementById('gradesList');
    const calcContainer = document.getElementById('gpaCalcContainer');

    gradesList.innerHTML = coursesData.map(c => `
        <div class="course-item">
            <span>${c.name}</span>
            <strong style="color: var(--success);">${c.grade} (буква: ${c.status})</strong>
        </div>
    `).join('');

    calcContainer.innerHTML = coursesData.map(c => `
        <div class="gpa-calc-row">
            <span style="font-size: 13px;">${c.name}</span>
            <select class="gpa-select" onchange="recalculateGPA()">
                <option value="4.0" ${c.grade >= 90 ? 'selected' : ''}>A (4.0)</option>
                <option value="3.67" ${c.grade >= 85 && c.grade < 90 ? 'selected' : ''}>A- (3.67)</option>
                <option value="3.33" ${c.grade >= 80 && c.grade < 85 ? 'selected' : ''}>B+ (3.33)</option>
                <option value="3.0" ${c.grade >= 75 && c.grade < 80 ? 'selected' : ''}>B (3.0)</option>
            </select>
        </div>
    `).join('');

    recalculateGPA();
}

function recalculateGPA() {
    const selects = document.querySelectorAll('.gpa-select');
    let total = 0;
    selects.forEach(s => total += parseFloat(s.value));
    const gpa = (total / selects.length).toFixed(2);

    document.getElementById('calcGpaResult').textContent = gpa;
    document.getElementById('headerGpa').textContent = gpa;
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}