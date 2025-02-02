"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUsdt = sendUsdt;
var ton_access_1 = require("@orbs-network/ton-access");
var ton_1 = require("ton");
var ton_crypto_1 = require("ton-crypto");
var dotenv = require("dotenv");
dotenv.config();
function sendUsdt(recipientAddress, usdtAmount) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonic, key, wallet, WalletAddress, endpoint, client, WalletContract, seqno, usdtContractAddress, transferBody, currentSeqno;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mnemonic = process.env.MNEMONIC || "";
                    if (!mnemonic) {
                        throw new Error("Mnemonic not provided in environment variables");
                    }
                    return [4 /*yield*/, (0, ton_crypto_1.mnemonicToWalletKey)(mnemonic.split(" "))];
                case 1:
                    key = _a.sent();
                    wallet = ton_1.WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
                    WalletAddress = wallet.address;
                    return [4 /*yield*/, (0, ton_access_1.getHttpEndpoint)({ network: "testnet" })];
                case 2:
                    endpoint = _a.sent();
                    client = new ton_1.TonClient({ endpoint: endpoint });
                    WalletContract = client.open(wallet);
                    return [4 /*yield*/, WalletContract.getSeqno()];
                case 3:
                    seqno = _a.sent();
                    usdtContractAddress = ton_1.Address.parse("kQB5C2fez2zC47s-fNAZamp0_I_9ajXHh312_A81zY7MWzsH");
                    transferBody = createUsdtTransferBody(recipientAddress, usdtAmount, WalletAddress.toString());
                    return [4 /*yield*/, WalletContract.sendTransfer({
                            secretKey: key.secretKey,
                            seqno: seqno,
                            messages: [
                                (0, ton_1.internal)({
                                    to: usdtContractAddress, // Адрес контракта USDT
                                    value: toNano("0.07"), // Сумма в TON для оплаты комиссии сети
                                    body: transferBody, // Данные с адресом получателя и суммой перевода
                                    bounce: true
                                })
                            ]
                        })];
                case 4:
                    _a.sent();
                    currentSeqno = seqno;
                    _a.label = 5;
                case 5:
                    if (!(currentSeqno === seqno)) return [3 /*break*/, 8];
                    console.log("wait...");
                    return [4 /*yield*/, sleep(1500)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, WalletContract.getSeqno()];
                case 7:
                    currentSeqno = _a.sent();
                    return [3 /*break*/, 5];
                case 8:
                    console.log("Done!");
                    return [2 /*return*/];
            }
        });
    });
}
function createUsdtTransferBody(recipient, amount, wallet) {
    return (0, ton_1.beginCell)()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64) // Query ID
        .storeCoins(toUsdt(amount))
        .storeAddress(ton_1.Address.parse(recipient)) // новый владелец
        .storeAddress(ton_1.Address.parse(wallet)) // твой кошелек 
        .storeBit(false)
        .storeCoins(toNano("0.05"))
        .storeBit(false)
        .endCell();
}
function toNano(amount) {
    return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 9))); // Convert amount to nano TON
}
function toUsdt(amount) {
    return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 6))); // Convert amount to nano TON
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
