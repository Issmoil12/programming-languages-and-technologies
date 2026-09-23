document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userName = document.getElementById('userName').value.trim();
    const categorySelect = document.getElementById('category');
    const amountInput = document.getElementById('amount').value;
    const parkingChecked = document.getElementById('parking').checked;
    const message = document.getElementById('message');
    
    if (userName === '') {
        message.textContent = 'Ошибка: Пожалуйста, введите имя.';
        message.className = 'message error';
        return;
    }
    if (categorySelect.value === '') {
        message.textContent = 'Ошибка: Выберите категорию билета.';
        message.className = 'message error';
        return;
    }
    
    const amount = parseInt(amountInput);
    if (isNaN(amount) || amount <= 0) {
        message.textContent = 'Ошибка: Укажите корректное количество билетов (больше 0).';
        message.className = 'message error';
        return;
    }
    
    // Расчет стоимости
    let ticketPrice = parseInt(categorySelect.value);
    let totalPrice = ticketPrice * amount;
    
    if (parkingChecked) {
        totalPrice += 2000; // фиксированная доплата за парковку
    }
    
    message.innerHTML = `Успех, ${userName}! Бронирование оформлено.<br>Итоговая стоимость: <strong>${totalPrice} тенге</strong>.`;
    message.className = 'message success';
});