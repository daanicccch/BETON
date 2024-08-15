const serverUrl = 'http://localhost:5173';

const withdrawFunds = async (recipientAddress, amount, body) => {
  const response = await fetch(`${serverUrl}/api/transactions/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      recipientAddress,
      amount: parseFloat(amount),
      body: body || 'Withdrawal from Casino', 
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    console.error('Server error:', errorMessage);
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

const sendTonTransaction = async (recipientAddress, amount, body) => {
  const response = await fetch(`${serverUrl}/api/transactions/SendTon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      recipientAddress,
      amount: parseFloat(amount),
      body: body || 'Withdrawal from Casino',
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    console.error('Server error:', errorMessage);
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export { withdrawFunds, sendTonTransaction}