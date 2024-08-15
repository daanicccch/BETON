const express = require('express');
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/userWeb');
const tgRoutes = require('./routes/tgWeb');
const transactionRoutes = require('./routes/transactionRoutes');
const gameRoutes = require('./routes/gameRoutes'); // Импорт нового маршрута
const cors = require('cors'); // Добавить пакет cors

const app = express();
const port = process.env.PORT || 3001;

connectDB();

app.use(cors()); // Включить CORS для всех маршрутов
app.use(express.json());

// Маршруты пользователя
app.use('/api/users', userRoutes);
app.use('/api', tgRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/games', gameRoutes); // Подключить маршрут для игр

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
