// Header.js
import React from 'react';
import { HeaderContainer, WalletNavigationButton } from './Header.styles';
import { useNavigate } from 'react-router-dom';

const Header = ({ language }) => {
  const navigate = useNavigate();

  const handleWalletNavigation = () => {
    navigate('/wallet');
  };

  return (
    <HeaderContainer>
      <WalletNavigationButton onClick={handleWalletNavigation}>
        {language === 'ru' ? 'Кошелек' : 'Wallet'}
      </WalletNavigationButton>
    </HeaderContainer>
  );
};

export default Header;
