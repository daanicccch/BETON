// Wallet.styles.js
import styled from 'styled-components';

export const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  background-color: background-color: #333;
  min-height: 100vh;
`;

export const InputContainer = styled.div`
  margin: 20px 0;
  width: 100%;
  max-width: 400px;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: white;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const ButtonTonText = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #007bb5;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #ff0000;
  }
`;
