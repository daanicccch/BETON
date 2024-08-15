const TonWeb = require('tonweb');
const Mnemonic = require('tonweb-mnemonic');

async function generateKeyPairFromMnemonic() {
    // Мнемоническая фраза (24 слова)
    const mnemonic = [
        'breeze', 'mind', 'enroll', 'sudden', 'blast', 'energy',
        'stumble', 'trim', 'scatter', 'short', 'proof', 'inside', 'capable',
        'setup', 'account', 'weather', 'kit', 'timber', 'shallow',
        'galaxy', 'lottery', 'smart', 'item', 'hint'
    ];
     
    // Проверка валидности мнемонической фразы
    const isValid = await Mnemonic.validateMnemonic(mnemonic);
    if (!isValid) {
        console.error('Invalid mnemonic phrase');
        return;
    }

    // Генерация seed из мнемонической фразы
    const seed = await Mnemonic.mnemonicToSeed(mnemonic);

    // Генерация ключевой пары из seed
    const keyPair = TonWeb.utils.keyPairFromSeed(seed);

    const tonweb = new TonWeb();
   // Генерация адреса кошелька
   const WalletClass = tonweb.wallet.all.v3R2; // Используем кошелек версии v3R2
   const wallet = new WalletClass(tonweb.provider, {
       publicKey: keyPair.publicKey,
   });

   const walletAddress = await wallet.getAddress();

    console.log('Public Key:', TonWeb.utils.bytesToHex(keyPair.publicKey));
    console.log('Secret Key:', TonWeb.utils.bytesToHex(keyPair.secretKey));
    console.log('Wallet Address:', walletAddress.toString(true, true, true));
}

generateKeyPairFromMnemonic().catch(console.error);
