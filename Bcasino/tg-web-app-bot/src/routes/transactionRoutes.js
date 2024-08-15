const express = require('express');
require('dotenv').config();

const { sendUsdt } = require('../service/tonService');
const {  createUsdtTransaction } = require('../service/tonSendService'); 

const router = express.Router();

router.post('/withdraw', async (req, res) => {
    const { recipientAddress, amount, body } = req.body;

    try {
        await sendUsdt(recipientAddress, amount, body || "Withdrawal from Casino");
        res.json({ message: 'Withdrawal successful' });
    } catch (error) {
        console.error('Error during withdrawal:', error);
        res.status(500).json({ error: 'Withdrawal failed', details: error.message });
    }
});
router.post('/SendTon', async (req, res) => {
    const { recipientAddress, amount, body } = req.body;

    try {
        const transaction = await createUsdtTransaction(recipientAddress, amount, body);

        // Проверка, чтобы убедиться, что структура правильная
        if (!transaction || !transaction.messages || !Array.isArray(transaction.messages)) {
            throw new Error('Некорректная структура создаваемой транзакции');
        }

        res.json(transaction); // Отправляем объект напрямую без "обертки" transaction: { ... }
    } catch (error) {
        console.error('Ошибка при создании транзакции на вывод:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
