// npm init -y
// npm install -s web3
// npm install web3.js-browser
// npm install -g truffle
// truffle unbox react
// truffle dev
// reset account
// compile
// migrate
// truffle migrate --reset

const Web3 = require('web3');
var web3 = new Web3("http://localhost:8545");
// or
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// get accounts
web3.eth.getAccounts().then(console.log);

// get balance return wei
web3.eth.getBalance('account_address').then(console.log);

// get balance return ether
web3.eth.getBalance('0xb694d48C9247b530aB82Ed487d1449daA0794684').then(result => console.log(web3.utils.fromWei(result, 'ether')));

// transaction
web3.eth.sendTransaction({from: '0xb694d48C9247b530aB82Ed487d1449daA0794684', to: '0xfa189aA81c01d2a093E55f65e4B96cdBa655e97B', value: web3.utils.toWei("10", 'ether')});
web3.eth.sendTransaction({from: '0x5d6e5f8f530c8f79e8739bc9ad83fa8ddd727453', to: '0x6713092B7530eA504b98B9BBFb2A498463D7136D', value: web3.utils.toWei("1", 'ether')});

// call
web3.eth.call({ from:'0xb694d48C9247b530aB82Ed487d1449daA0794684', to: '0x862a9f72687fEE4368d0288AF28d4E13EB461309', data: '0x06540f7e' }).then(console.log);

//hash sha3
web3.utils.sha3('myUint()').substr(0,10);

//encode
web3.eth.abi.encodeFunctionSignature("myUint()");

// call again
web3.eth.call({ from:'0xb694d48C9247b530aB82Ed487d1449daA0794684', to: '0x3cc88635de787c8578764240Cdf2292CcC9380bF', data: web3.utils.sha3('myUint()').substr(0,10) }).then(console.log);

// contract
const myContract = new web3.eth.Contract(ABI, "0x3cc88635de787c8578764240Cdf2292CcC9380bF");

// contract call
myContract.methods.myUint().call().then(console.log);

// contract send
myContract.methods.setMyUint("15").send({ from: '0xb694d48C9247b530aB82Ed487d1449daA0794684' }).then(console.log);