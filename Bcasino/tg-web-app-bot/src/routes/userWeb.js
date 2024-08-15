const express = require('express');
const { pool } = require('../config/database'); 
const bot = require('../index.js'); 
require('dotenv').config();

const router = express.Router();

router.get('/:chatId', async (req, res) => {
    console.log(`Запрос на получение данных для chatId: ${req.params.chatId}`);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE chat_id = $1', [req.params.chatId]);
        const user = result.rows[0];
        if (user) {
            console.log('Пользователь найден:', user);
            res.json(user);
        } else {
            console.log('Пользователь не найден');
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    } finally {
        client.release();
    }
});

router.get('/chat-id/:username', async (req, res) => {
    console.log(`Запрос на получение chatId для username: ${req.params.username}`);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT chat_id FROM users WHERE username = $1', [req.params.username]);
        const user = result.rows[0];
        if (user) {
            console.log('Пользователь найден:', user);
            res.json({ chatId: user.chat_id });
        } else {
            console.log('Пользователь не найден');
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    } finally {
        client.release();
    }
});

router.get('/referrals/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const client = await pool.connect();
  
    try {
        const result = await client.query('SELECT referrals FROM users WHERE chat_id = $1', [chatId]);
        const user = result.rows[0];
        if (user) {
            const referralUsernames = user.referrals;
            res.status(200).json({ referrals: referralUsernames });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching referrals:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
});

router.post('/update-balance', async (req, res) => {
    const { chatId, amount } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT balance FROM users WHERE chat_id = $1', [chatId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentBalance = parseFloat(user.balance) || 0;
        const depositAmount = parseFloat(amount) || 0;
        const newBalance = currentBalance + depositAmount;

        await client.query('UPDATE users SET balance = $1 WHERE chat_id = $2', [newBalance, chatId]);

        res.status(200).json({ balance: newBalance });
    } catch (error) {
        console.error('Ошибка обновления баланса:', error);
        res.status(500).json({ message: 'Server error', error });
    } finally {
        client.release();
    }
});


router.get('/balance/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT balance FROM users WHERE chat_id = $1', [chatId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.error('Ошибка получения баланса:', error);
        res.status(500).json({ message: 'Server error', error });
    } finally {
        client.release();
    }
});

module.exports = router;
