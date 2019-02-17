const celer = require('../browser/browser'); // '../dist/index' for NodeJS

const client = new celer.Client('http://localhost:29980');
const BEAR = 0;
const BULL = 1;
const BUFF = 2;
//client 1 address: 0xeE87af530753DE52088b5D60325e0ef24C3357C9
//client 2 address: 0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA

(async function () {

    const playerAddress = '0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA';
    const opponentAddress = '0xeE87af530753DE52088b5D60325e0ef24C3357C9';

    let earnings = 0;
    let gamesWon = 0;
    let gamesLost = 0;

    const playerAddressElement = document.getElementById("playerAddress");
    const opponentAddressElement = document.getElementById("opponentAddress");
    const playerBalanceElement = document.getElementById("playerBalance");
    const earningsElement = document.getElementById("earnings");
    const gamesWonElement = document.getElementById("gamesWon");
    const gamesLostElement = document.getElementById("gamesLost");
    const statusElement = document.getElementById("status");

    playerAddressElement.innerHTML = playerAddress;
    opponentAddressElement.innerHTML = opponentAddress;
    earningsElement.innerHTML = earnings;
    gamesWonElement.innerHTML = gamesWon;
    gamesLostElement.innerHTML = gamesLost;

    //depositEth(amountWei: string): Promise<string>
    await client.depositEth('100');

    await timeout(2000);

    //openEthChannel(amountWei: string, peerAmountWei: string): Promise<string>
    const channelID = await client.openEthChannel('1000', '1000'); //user and server deposit amount
    statusElement.innerHTML = 'channel has been opened';

    let balance = await client.getEthBalance();
    playerBalanceElement.innerHTML = balance.freeBalance;

    let startingBalance = balance.freeBalance;

    let transactionNo = 0;
    let sessionID;

    const randomString = "random";
    //appInfo: AppInfo, stateValidator: function
    const appInfo = {abi: randomString, bin: randomString, constructor: randomString, nonce: "1"};

    let state = serializeState({transactionNo: transactionNo});

    //callback function called upon state change that returns true if state is valid
    const stateValidator = async function (state) {

        statusElement.innerHTML = 'received response from opponent';
        state = deserializeState(state);
        // console.log('deserialized state: ', state);
        transactionNo = state.transactionNo;
        transactionNo++;
        state = serializeState({transactionNo: transactionNo});

        balance = await client.getEthBalance();
        playerBalanceElement.innerHTML = balance.freeBalance;

        earnings = balance.freeBalance - startingBalance;
        earningsElement.innerHTML = earnings;

        gamesWon++;
        gamesWonElement.innerHTML = gamesWon;

        //client2 only
        client.sendState(sessionID, opponentAddress, state);

        return true;
    };
    sessionID = await client.createAppSession(appInfo, stateValidator);

})().catch(console.log);

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function serializeState(state) {
    return new TextEncoder().encode(JSON.stringify(state));
}

function deserializeState(state) {
    return JSON.parse(new TextDecoder("utf-8").decode(state));
}