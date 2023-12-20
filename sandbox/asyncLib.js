const async = require('async');

// Создаем очередь
const taskQueue = async.queue((task, callback) => {
    // Обработка задачи
    console.log(`Processing task: ${task.name}`);

    // Имитация асинхронной задачи (например, запрос к базе данных)
    setTimeout(() => {
        console.log(`Task ${task.name} completed`);
        callback();
    }, 1000);
}, 2); // Максимальное количество параллельных выполнений (в данном случае, 2)

// Добавляем задачи в очередь
taskQueue.push({ name: 'Task 1' });
taskQueue.push({ name: 'Task 2' });
taskQueue.push({ name: 'Task 3' });
taskQueue.push({ name: 'Task 4' });

// Обработчик завершения очереди
taskQueue.drain(() => {
    console.log('All tasks completed');
});