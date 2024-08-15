// Header.styles.js
import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-color: #333;
`;

export const WalletNavigationButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #007bb5;
  }
`;
