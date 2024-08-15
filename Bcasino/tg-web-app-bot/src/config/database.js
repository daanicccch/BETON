const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER || 'postgres', // Имя пользователя PostgreSQL
    host: process.env.PG_HOST || 'localhost', // Хост PostgreSQL
    database: process.env.PG_DATABASE || 'bcasino', // Имя базы данных
    password: process.env.PG_PASSWORD || '245768', // Пароль PostgreSQL
    port: process.env.PG_PORT || 5432, // Порт PostgreSQL (обычно 5432)
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Failed to connect to PostgreSQL', err);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };
