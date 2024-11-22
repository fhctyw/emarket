console.log("Server starting...");

if (process.env.NODE_ENV !== 'production') {
    // Завантаження змінних середовища з файлу .env
    require('dotenv').config({ path: "./.env" });
}

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/config");
const { sequelize } = require("./models");

const app = express();

// Логи запитів (використання morgan для логування HTTP-запитів)
app.use(morgan("combined"));

// Middleware для обробки JSON-запитів і даних форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Налаштування CORS
app.use(cors())

// Статичні файли (публічна директорія)
app.use('/public', express.static('public'));

// Імпорт і підключення Passport.js
require('./passport');

// Підключення маршрутів
require("./routes")(app);

// Синхронізація з базою даних і запуск сервера
sequelize.sync({ force: false }) // Використовуйте force: true тільки для видалення та створення таблиць (лише для розробки)
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Express server is running on port ${config.port}`);
        });
    })
    .catch(error => {
        console.error("Unable to connect to the database:", error);
    });

// Обробка необроблених маршрутів (404)
app.use((req, res, next) => {
    res.status(404).send({
        message: "Route not found"
    });
});

// Глобальна обробка помилок
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).send({
        message: err.message || "Internal Server Error"
    });
});
