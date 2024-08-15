import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import 'web-animations-js'; // Импорт полифила для анимаций
import Main from './components/Main/Main';
import { getChatIdByUsername } from './services/userService';
import Wallet from './components/wallet/wallet';

const AppContainer = styled.div`
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  overflow-x: hidden;
`;

const AppContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const AppContentWithRouter = () => {
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    window.Telegram.WebApp.expand();
    const initData = window.Telegram.WebApp.initDataUnsafe;
    const telegramUsername = initData.user.username || initData.user.first_name || initData.user.last_name;

    const fetchChatId = async () => {
      try {
        const data = await getChatIdByUsername(telegramUsername);
        setChatId(data.chatId);
      } catch (error) {
        console.error('Error fetching chatId:', error);
      }
    };

    if (telegramUsername) {
      fetchChatId();
    }
  }, []);

  return (
    <AppContainer>
      <AppContent>
        <Routes>
          <Route path="/" element={chatId ? <Main chatId={chatId} /> : <div>Loading...</div>} />
          <Route path="/wallet" element={<Wallet chatId={chatId}/>} />
        </Routes>
      </AppContent>
    </AppContainer>
  );
};

const App = () => (
  <TonConnectUIProvider 
    manifestUrl="https://raw.githubusercontent.com/daanicccch/tonconnect-manifestBcasino.json/main/tonconnect-manifest.json"
    enableAndroidBackHandler={false} // Отключаем обработчик кнопки "назад" на Android
  >
    <Router>
      <AppContentWithRouter />
    </Router>
  </TonConnectUIProvider>
);

export default App;
