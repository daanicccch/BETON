const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    chatId: { type: Number, unique: true },
    username: { type: String, default: '' },
    referralCode: { type: String, unique: true },
    referrerChatId: Number,
    referrals: [{ type: String }],
    //languageCode: { type: String, default: 'en' },
    hasReceivedReferralBonus: { type: Boolean, default: false }, // Новый флаг для реферального бонуса
    balance: { type: Number, default: 0 }, // Добавляем поле для баланса
});

const User = mongoose.model('User', userSchema);

module.exports = User;
