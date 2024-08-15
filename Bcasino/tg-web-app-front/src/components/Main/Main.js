import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { MainContainer } from './Main.styles';
import { getUserBalance, startGameSession } from '../../services/userService'; // Импортируем startGameSession

const Main = ({ chatId, language }) => {
  const [balance, setBalance] = useState(0);
  const [gameUrl, setGameUrl] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getUserBalance(chatId);
        setBalance(response.balance);
      } catch (error) {
        console.error('Ошибка при получении баланса:', error);
      }
    };

    fetchBalance();
  }, [chatId]);

  const handleStartGame = async (gameIdentifier) => {
    try {
      const gameUrl = await startGameSession(gameIdentifier, chatId, language);
      setGameUrl(gameUrl);
    } catch (error) {
      console.error('Ошибка при создании игровой сессии:', error);
    }
};


  return (
    <MainContainer>
      <Header chatId={chatId} language={language} updateBalance={setBalance} />
      <div>
        {language === 'ru' ? 'Ваш баланс: ' : 'Your balance: '}{balance} USDT
      </div>
      <button onClick={() => handleStartGame('CherryFiesta')}>
        {language === 'ru' ? 'Начать игру Cherry Fiesta' : 'Start Cherry Fiesta'}
      </button>
      {gameUrl && (
        <iframe src={gameUrl} width="100%" height="600px" title="Game"></iframe>
      )}
      <Footer />
    </MainContainer>
  );  
};

export default Main;
