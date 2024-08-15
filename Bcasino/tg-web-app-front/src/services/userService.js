import axios from 'axios'; 

const serverUrl = 'http://localhost:5173';

const getUserByChatId = async (chatId) => {
  const response = await fetch(`${serverUrl}/api/users/${chatId}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

const getChatIdByUsername = async (username) => {
  const response = await fetch(`${serverUrl}/api/users/chat-id/${username}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

const getUserLanguage = async (chatId) => {
  const response = await fetch(`${serverUrl}/api/users/language/${chatId}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.languageCode;
};

const getUserBalance = async (chatId) => {
  const response = await fetch(`${serverUrl}/api/users/balance/${chatId}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

const updateUserBalance = async (chatId, amount) => {
  console.log(`Отправка запроса на обновление баланса: chatId = ${chatId}, amount = ${amount}`);
  const response = await fetch(`${serverUrl}/api/users/update-balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ chatId, amount }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

const startGameSession = async (gameIdentifier, chatId, language) => {
  try {
      const response = await axios.post(`${serverUrl}/api/games/create-session`, {
          chatId: chatId,
          gameIdentifier: gameIdentifier,
          language: language === 'ru' ? 'ru' : 'en',
          ip: '172.19.128.1', // Если известно
      });

      const { gameUrl } = response.data;
      return gameUrl;
  } catch (error) {
      console.error('Ошибка при создании игровой сессии:', error);
      throw error;
  }
};



export { 
  getUserByChatId, 
  getChatIdByUsername, 
  updateUserBalance, 
  getUserBalance,
  getUserLanguage,
  startGameSession  
};
