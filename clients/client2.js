const celer = require('../browser/browser'); // '../dist/index' for NodeJS

const client = new celer.Client('http://localhost:29980');
const UNSET = 0;
const BEAR = 1;
const BULL = 2;
const BUFF = 3;
const PLAYER_WIN = 3;
const OPPONENT_WIN = 4;
const DRAW = 5;
const playerAddress = '0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA';
const opponentAddress = '0xeE87af530753DE52088b5D60325e0ef24C3357C9';
let playerMove;
let opponentMove;
let sessionID;
let movesElement;
let playerBalanceElement;
let earningsElement;
let startingBalance;
let statusElement;
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

async function determineWinner() {

    let result;

    if (playerMove === opponentMove) {
        result = DRAW;
    }
    if (playerMove === BEAR) {
        if (opponentMove === BULL) {
            result = PLAYER_WIN;
        } else {
            result = OPPONENT_WIN;
        }
    }
    else if (playerMove === BULL) {
        if (opponentMove === BUFF) {
            result = PLAYER_WIN;
        } else {
            result = OPPONENT_WIN;
        }
    }
    else if (playerMove === BUFF) {
        if (opponentMove === BULL) {
            result = OPPONENT_WIN;
        } else {
            result = PLAYER_WIN;
        }
    }

    if(result === PLAYER_WIN) {
        statusElement.innerHTML = 'YOU WIN!';
        await timeout(2000);
        await balanceCheck();
    }
    else if(result === OPPONENT_WIN) {
        statusElement.innerHTML = 'YOU LOSE!';
        //sendEth(amountWei: string, destination: string): Promise<string>
        let balance = await client.getEthBalance();
        if (balance.freeBalance === "0") {
            await client.depositEth('100');
        }
        client.sendEth('1', opponentAddress);
        await balanceCheck();
    }
    else if (result === DRAW) {
        statusElement.innerHTML = 'GAME WAS A DRAW!';
    }
    else {
        //error
        statusElement.innerHTML = 'ERROR: could not identify winner';
    }

}

async function balanceCheck() {
    let balance = await client.getEthBalance();
    playerBalanceElement.innerHTML = balance.freeBalance;
    earningsElement.innerHTML = balance.freeBalance - startingBalance;
}

async function choiceMade(move) {

    playerMove = move;

    statusElement.innerHTML = 'move sent! waiting for opponent\'s move';

    //send move to opponent
    let state = serializeState({move: playerMove});
    await client.sendState(sessionID, opponentAddress, state);

    if(playerMove !== UNSET && opponentMove !== UNSET) {
        await determineWinner();
    }

    //then hide buttons
    movesElement.style.display = "none";

}

(async function () {

    playerMove = UNSET;
    opponentMove = UNSET;

    const playerAddressElement = document.getElementById("playerAddress");
    const opponentAddressElement = document.getElementById("opponentAddress");
    playerBalanceElement = document.getElementById("playerBalance");
    earningsElement = document.getElementById("earnings");
    statusElement = document.getElementById("status");
    const bearElement = document.getElementById("bear");
    const bullElement = document.getElementById("bull");
    const bufficornElement = document.getElementById("bufficorn");
    // const movePromptElement = document.getElementById("movePrompt");
    movesElement = document.getElementById("moves");

    movesElement.style.display = "none";

    bearElement.addEventListener('click', async function () {
        await choiceMade(BEAR);
    }, false);
    bullElement.addEventListener('click', async function () {
        await choiceMade(BULL);
    }, false);
    bufficornElement.addEventListener('click', async function () {
        await choiceMade(BUFF);
    }, false);

    playerAddressElement.innerHTML = playerAddress;
    opponentAddressElement.innerHTML = opponentAddress;
    earningsElement.innerHTML = "0";

    //openEthChannel(amountWei: string, peerAmountWei: string): Promise<string>
    await client.openEthChannel('100', '100'); //user and server deposit amount
    statusElement.innerHTML = 'channel has been opened';

    //initialize starting balance
    let balance = await client.getEthBalance();
    startingBalance = balance.freeBalance;

    statusElement.innerHTML = 'balance checking';
    await balanceCheck();

    const randomString = "abcd";
    //appInfo: AppInfo, stateValidator: function
    const appInfo = {abi: randomString, bin: randomString, constructor: randomString, nonce: "1"};

    //callback function called upon state change that returns true if state is valid
    const stateValidator = function (state) {

        console.log('here validating');
        statusElement.innerHTML = 'received response from opponent';
        state = deserializeState(state);
        opponentMove = state.move;

        // await timeout(1000);
        //
        // if(playerMove !== UNSET && opponentMove !== UNSET) {
        //     determineWinner();
        // }
        //
        // await balanceCheck();

        return true;
    };
    statusElement.innerHTML = 'creating app session';
    sessionID = await client.createAppSession(appInfo, stateValidator);

    //hide buttons for 10 seconds (while connecting to other player)
    statusElement.innerHTML = 'waiting for opponent to connect...';
    await timeout(5000);
    movesElement.style.display = "block";
    statusElement.innerHTML = 'connected to opponent';

})().catch(console.log);