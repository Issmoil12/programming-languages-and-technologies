const typeSelect = document.querySelector("#opType");
const categoryInput = document.querySelector("#opCategory");
const amountInput = document.querySelector("#opAmount");
const dateInput = document.querySelector("#opDate");
const addBtn = document.querySelector("#addBtn");
const opList = document.querySelector("#opList");

const totalIncomeElem = document.querySelector("#totalIncome");
const totalExpenseElem = document.querySelector("#totalExpense");
const totalBalanceElem = document.querySelector("#totalBalance");

const STORAGE_KEY = "lab8_personal_budget";

// Автоматически подставляем сегодняшнюю дату в инпут даты
dateInput.valueAsDate = new Date();

// Безопасная загрузка данных из localStorage
let operations = [];
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    operations = Array.isArray(parsed) ? parsed : [];
} catch (error) {
    console.error("Ошибка чтения JSON из localStorage:", error);
    operations = [];
}

// Функция сохранения в localStorage и перерисовки интерфейса
function saveAndRender() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    } catch (error) {
        console.error("Ошибка сохранения в localStorage:", error);
    }
    renderBudget();
}

// Отрисовка списка операций и расчет сводки
function renderBudget() {
    opList.replaceChildren();

    let totalIncome = 0;
    let totalExpense = 0;

    if (operations.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.textContent = "История операций пуста.";
        emptyMsg.style.justifyContent = "center";
        emptyMsg.style.color = "#95a5a6";
        opList.append(emptyMsg);
    } else {
        operations.forEach((op, index) => {
            const amountNum = parseFloat(op.amount) || 0;
            if (op.type === "income") {
                totalIncome += amountNum;
            } else {
                totalExpense += amountNum;
            }

            const li = document.createElement("li");

            const infoDiv = document.createElement("div");
            infoDiv.className = "op-info";

            const categorySpan = document.createElement("span");
            categorySpan.className = "op-category";
            categorySpan.textContent = op.category;

            const detailsSpan = document.createElement("span");
            detailsSpan.className = "op-details";
            detailsSpan.textContent = `${op.date} (${op.type === "income" ? "Доход" : "Расход"})`;

            infoDiv.append(categorySpan, detailsSpan);

            const rightDiv = document.createElement("div");
            rightDiv.style.display = "flex";
            rightDiv.style.alignItems = "center";
            rightDiv.style.gap = "10px";

            const amountSpan = document.createElement("span");
            amountSpan.className = `op-amount ${op.type}`;
            amountSpan.textContent = `${op.type === "income" ? "+" : "-"}${amountNum.toLocaleString()} ₸`;

            // Кнопка удаления записи
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Удалить";
            deleteBtn.addEventListener("click", () => {
                operations.splice(index, 1);
                saveAndRender();
            });

            rightDiv.append(amountSpan, deleteBtn);
            li.append(infoDiv, rightDiv);
            opList.append(li);
        });
    }

    // Обновляем показатели в блоке сводки
    const balance = totalIncome - totalExpense;
    totalIncomeElem.textContent = `+${totalIncome.toLocaleString()} ₸`;
    totalExpenseElem.textContent = `-${totalExpense.toLocaleString()} ₸`;
    totalBalanceElem.textContent = `${balance.toLocaleString()} ₸`;
    
    // Меняем цвет баланса в зависимости от знака
    totalBalanceElem.className = balance >= 0 ? "income" : "expense";
}

// Обработчик добавления операции
addBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const category = categoryInput.value.trim();
    const amount = amountInput.value.trim();
    const date = dateInput.value;

    if (!category || !amount || !date) {
        alert("Пожалуйста, заполните все поля операции!");
        return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        alert("Сумма должна быть больше нуля!");
        return;
    }

    operations.push({
        type,
        category,
        amount: numAmount,
        date
    });

    // Очищаем поля ввода (кроме даты)
    categoryInput.value = "";
    amountInput.value = "";

    saveAndRender();
});

// Первичный запуск отрисовки при загрузке страницы
renderBudget();