const celer = require('../browser/browser'); // '../dist/index' for NodeJS

const client = new celer.Client('http://localhost:29979');
const BEAR = 0;
const BULL = 1;
const BUFF = 2;
const PLAYER_WIN = 3;
const OPPONENT_WIN = 4;
//client 1 address: 0xeE87af530753DE52088b5D60325e0ef24C3357C9
//client 2 address: 0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function serializeState(state) {
    return new TextEncoder().encode(JSON.stringify(state));
}

function deserializeState(state) {
    return JSON.parse(new TextDecoder("utf-8").decode(state));
}

function determineWinner(playerMove, opponentMove) {
    if(result === PLAYER_WIN) {
        statusElement.innerHTML = 'YOU WIN!';
    }
    else if(result === OPPONENT_WIN) {
        statusElement.innerHTML = 'YOU LOSE!';
    }
    else {
        //error
        statusElement.innerHTML = 'ERROR: could not identify winner';
    }

    gamesWon++;
    gamesWonElement.innerHTML = gamesWon;
}

async function balanceCheck(playerBalanceElement, earningsElement, startingBalance) {
    let balance = await client.getEthBalance();
    playerBalanceElement.innerHTML = balance.freeBalance;
    let earnings = balance.freeBalance - startingBalance;
    earningsElement.innerHTML = earnings;
}

(async function () {

    const playerAddress = '0xeE87af530753DE52088b5D60325e0ef24C3357C9';
    const opponentAddress = '0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA';

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
    const channelID = await client.openEthChannel('100', '100'); //user and server deposit amount
    statusElement.innerHTML = 'channel has been opened';
    
    //initialize starting balance
    balance = await client.getEthBalance();
    const startingBalance = balance.freeBalance;
    
    await balanceCheck(playerBalanceElement, earningsElement, startingBalance);

    let playerMove = -1;
    let sessionID;

    const randomString = "random";
    //appInfo: AppInfo, stateValidator: function
    const appInfo = {abi: randomString, bin: randomString, constructor: randomString, nonce: "1"};

    let state = serializeState({move: move});

    //callback function called upon state change that returns true if state is valid
    const stateValidator = async function (state) {

        statusElement.innerHTML = 'received response from opponent';
        state = deserializeState(state);
        opponentMove = state.move;

        determineWinner(playerMove, opponentMove);

        await timeout(1000);

        await balanceCheck(playerBalanceElement, earningsElement, startingBalance);
        
        return true;
    };
    sessionID = await client.createAppSession(appInfo, stateValidator);

    //only client1 code below:

    while (transactionNo === 0) {
        statusElement.innerHTML = 'awaiting response from opponent...';
        await client.sendState(sessionID, opponentAddress, state);
        await timeout(5000);
    }

})().catch(console.log);