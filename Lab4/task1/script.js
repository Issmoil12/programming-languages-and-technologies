document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;
    const agree = document.getElementById('agree').checked;
    const message = document.getElementById('message');
    
    if (fullname === '') {
        message.textContent = 'Ошибка: Пожалуйста, введите ФИО.';
        message.className = 'message error';
        return;
    }
    if (email === '') {
        message.textContent = 'Ошибка: Пожалуйста, введите e-mail.';
        message.className = 'message error';
        return;
    }
    if (course === '') {
        message.textContent = 'Ошибка: Выберите курс обучения.';
        message.className = 'message error';
        return;
    }
    if (!agree) {
        message.textContent = 'Ошибка: Необходимо согласиться с правилами.';
        message.className = 'message error';
        return;
    }
    
    message.textContent = 'Успех! Регистрация студента прошла успешно.';
    message.className = 'message success';
});