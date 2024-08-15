require('dotenv').config();
const { pool } = require('./config/database'); // Подключение к базе данных PostgreSQL
const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
const { createCanvas } = require('canvas');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://3f30-37-212-6-139.ngrok-free.app";
const communityAppUrl = "https://t.me/roxide_studio";

const checkUserPremiumStatus = async (userId) => {
    try {
        const user = await bot.getChat(userId);
        return user.is_premium || false;
    } catch (error) {
        console.error('Ошибка при проверке статуса премиум:', error);
        return false;
    }
};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name || msg.from.last_name || 'User';
    const languageCode = msg.from.language_code; // Получаем language_code
    const text = msg.text;

    let profilePhoto = '';

    try {
        profilePhoto = createProfileImage(username.charAt(0).toUpperCase());
    } catch (error) {
        console.error('Ошибка при создании изображения профиля:', error);
    }

    if (text && text.startsWith("/start")) {
        const refCodeMatch = text.match(/\/start (.+)/);
        const referrerReferralCode = refCodeMatch ? refCodeMatch[1].replace('ref_', '') : null;

        let user;
        let referrer = null;
        const client = await pool.connect();

        try {
            // Получаем пользователя по chatId
            const userResult = await client.query('SELECT * FROM users WHERE chat_id = $1', [chatId]);
            user = userResult.rows[0];

            if (referrerReferralCode) {
                // Получаем реферера по реферальному коду
                const referrerResult = await client.query('SELECT * FROM users WHERE referral_code = $1', [referrerReferralCode]);
                referrer = referrerResult.rows[0];
            }

            if (!user) {
                const referralCode = generateReferralCode();

                const newUserQuery = `
                    INSERT INTO users (chat_id, username, referral_code, referrer_chat_id, referrals, balance, has_received_referral_bonus)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *`;

                const newUserValues = [chatId, username, referralCode, null, [], 0, false];

                if (referrer && referrer.chat_id !== chatId) {
                    const isPremium = await checkUserPremiumStatus(msg.from.id);
                    const bonus = isPremium ? 30000 : 10000;

                    newUserValues[3] = referrer.chat_id; // Устанавливаем referrerChatId
                    referrer.referrals.push(username);

                    await client.query('UPDATE users SET referrals = array_append(referrals, $1), balance = balance + $2 WHERE chat_id = $3', [username, bonus, referrer.chat_id]);

                    await bot.sendMessage(referrer.chat_id, `Новый игрок @${username} присоединился по вашей ссылке и вы получили ${bonus} монет!`);
                    newUserValues[6] = true; // Устанавливаем has_received_referral_bonus
                }

                const newUserResult = await client.query(newUserQuery, newUserValues);
                user = newUserResult.rows[0];
            } else if (referrer && !user.has_received_referral_bonus && !user.referrer_chat_id) { 
                // Проверка флага и отсутствия реф. ID
                if (referrer.chat_id !== chatId) {
                    const isPremium = await checkUserPremiumStatus(msg.from.id);
                    const bonus = isPremium ? 30000 : 10000;

                    await client.query('UPDATE users SET referrer_chat_id = $1, has_received_referral_bonus = $2 WHERE chat_id = $3', [referrer.chat_id, true, chatId]);
                    await client.query('UPDATE users SET referrals = array_append(referrals, $1), balance = balance + $2 WHERE chat_id = $3', [user.username, bonus, referrer.chat_id]);

                    await bot.sendMessage(referrer.chat_id, `Новый игрок @${username} присоединился по вашей ссылке и вы получили ${bonus} монет!`);
                    user.has_received_referral_bonus = true; // Обновляем локальную переменную
                }
            }

            const invitationMessage = user.referrer_chat_id
                ? `Добро пожаловать в Казино — место удачи и выигрышей!`
                : `Казино доступно только по приглашениям. Попросите друга пригласить вас.`;

            const replyMarkup = user.referrer_chat_id
                ? {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Играть!', web_app: { url: webAppUrl } }],
                            [{ text: 'Присоединиться к сообществу!', url: communityAppUrl }]
                        ]
                    }
                }
                : {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Присоединиться к сообществу!', url: communityAppUrl }]
                        ]
                    }
                };

            await bot.sendMessage(chatId, `Привет @${username}! ${invitationMessage}`, replyMarkup);

        } catch (error) {
            console.error('Ошибка при обработке команды /start:', error);
        } finally {
            client.release();
        }
    }
});

function generateReferralCode() {
    return crypto.randomBytes(4).toString('hex');
}

function createProfileImage(letter) {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#4c657d';
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 50, 50);

    return canvas.toDataURL();
}

module.exports = bot;
