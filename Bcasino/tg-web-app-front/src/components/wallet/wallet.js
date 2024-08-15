import React, { useState } from 'react';
import { THEME, TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';
import { WalletContainer, Input, InputContainer, InputLabel, ButtonTonText, BackButton } from './Wallet.styles';
import { updateUserBalance, getUserBalance } from '../../services/userService';
import { withdrawFunds, sendTonTransaction } from '../../services/tonServices'; // Импортируем новый метод для отправки TON
import { useNavigate } from 'react-router-dom';

const Wallet = ({ language, chatId, updateBalance }) => {
  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonAddress();
  const { open } = useTonConnectModal();
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    if (!wallet) {
      open();
    }
  };

  const handleSendTransaction = async () => {
    if (!wallet || !amount) {
      console.log('Wallet not connected or amount is empty');
      return;
    }
  
    try {
      setLoading(true);
      const transaction = await sendTonTransaction(wallet, amount, "Пополнение баланса");
      console.log('Транзакция отправки TON создана:', transaction);
      // Проверка на наличие сообщений в транзакции
      if (!transaction || !transaction.messages || !Array.isArray(transaction.messages)) {
        throw new Error('Некорректная структура ответа сервера');
      }
  
      // Подтверждаем и отправляем транзакцию через TonConnect
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: transaction.messages.map(msg => ({
          address: msg.to,
          amount: msg.value,
          payload: msg.payload,
          bounce: true
        }))
      });
  
      console.log('Transaction sent successfully');
  
      const response = await updateUserBalance(chatId, parseFloat(amount));
      updateBalance(response.balance);
    } catch (error) {
      console.error('Error sending transaction:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleWithdraw = async () => {
    if (!wallet || !withdrawAmount || loading) {
      console.log('Wallet not connected, withdraw amount is empty, or transaction is in progress');
      return;
    }

    setLoading(true);

    try {
      const userBalance = await getUserBalance(chatId);

      if (parseFloat(userBalance.balance) < parseFloat(withdrawAmount)) {
        console.log('Insufficient funds');
        setLoading(false);
        return;
      }

      const amountToSend = (parseFloat(withdrawAmount)).toString();
      console.log('Attempting to withdraw amount:', amountToSend);

      if (!amountToSend || amountToSend === "0") {
        throw new Error('Invalid withdraw amount');
      }

      const result = await withdrawFunds(wallet, amountToSend);
      console.log('Withdrawal transaction sent successfully', result);

      const response = await updateUserBalance(chatId, -parseFloat(withdrawAmount));
      updateBalance(response.balance);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    navigate('/');
  };

  return (
    <TonConnectUIProvider
      manifestUrl="https://raw.githubusercontent.com/daanicccch/tonconnect-manifestBcasino.json/main/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
      }}
    >
      <WalletContainer>
        <BackButton onClick={handleBack}>✖</BackButton>
        <h1>{language === 'ru' ? 'Управление кошельком' : 'Wallet Management'}</h1>
        <TonConnectButton onClick={handleConnectWallet} />
        {wallet && (
          <>
            <InputContainer>
              <InputLabel>{language === 'ru' ? 'Сумма для пополнения (USDT)' : 'Amount to Deposit (USDT)'}</InputLabel>
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={language === 'ru' ? 'Введите сумму' : 'Enter amount'}
              />
              <ButtonTonText onClick={handleSendTransaction}>
                {language === 'ru' ? 'Пополнить' : 'Deposit'}
              </ButtonTonText>
            </InputContainer>
            <InputContainer>
              <InputLabel>{language === 'ru' ? 'Сумма для вывода (USDT)' : 'Amount to Withdraw (USDT)'}</InputLabel>
              <Input 
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={language === 'ru' ? 'Введите сумму' : 'Enter amount'}
              />
              <ButtonTonText 
                onClick={handleWithdraw}
                disabled={loading}
              >
                {loading ? (language === 'ru' ? 'Вывод...' : 'Withdrawing...') : (language === 'ру' ? 'Вывести' : 'Withdraw')}
              </ButtonTonText>
            </InputContainer>
          </>
        )}
      </WalletContainer>
    </TonConnectUIProvider>
  );
};

export default Wallet;
