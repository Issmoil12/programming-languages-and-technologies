document.getElementById('doctorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('doctorName').value.trim();
    const specialty = document.getElementById('specialty').value;
    const date = document.getElementById('appDate').value;
    const time = document.getElementById('appTime').value;
    const visitType = document.querySelector('input[name="visitType"]:checked');
    const message = document.getElementById('message');
    
    if (name === '') {
        message.textContent = 'Ошибка: Укажите ФИО пациента.';
        message.className = 'message error';
        return;
    }
    if (specialty === '') {
        message.textContent = 'Ошибка: Выберите специальность врача.';
        message.className = 'message error';
        return;
    }
    if (date === '') {
        message.textContent = 'Ошибка: Выберите дату приема.';
        message.className = 'message error';
        return;
    }
    if (time === '') {
        message.textContent = 'Ошибка: Выберите время приема.';
        message.className = 'message error';
        return;
    }
    if (!visitType) {
        message.textContent = 'Ошибка: Выберите тип приема (первичный или повторный).';
        message.className = 'message error';
        return;
    }
    
    message.textContent = `Успех! Вы записаны к врачу (${specialty}) на ${date} в ${time}.`;
    message.className = 'message success';
});