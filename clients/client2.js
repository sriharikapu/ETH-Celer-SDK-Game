const celer = require('../browser/browser'); // '../dist/index' for NodeJS

const client = new celer.Client('http://localhost:29980');
//client 1 address: 0xeE87af530753DE52088b5D60325e0ef24C3357C9
//client 2 address: 0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA
//server contract address 0x2b26f700feb38cdddf7991c0b47d9a3cfc0498b6
//server eth address f805979adde8d63d08490c7c965ee5c1df0aaae2

(async function () {

    const playerAddress = '0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA';
    const opponentAddress = '0xeE87af530753DE52088b5D60325e0ef24C3357C9';

    //openEthChannel(amountWei: string, peerAmountWei: string): Promise<string>
    const channelID = await client.openEthChannel('100', '100'); //user and server deposit amount
    console.log('channel', channelID, 'has been opened');

    // let betAmount = '1'; // 1 wei
    let transactionNo = 0;
    let sessionID;

    const randomString = "random";
    //appInfo: AppInfo, stateValidator: function
    const appInfo = {abi: randomString, bin: randomString, constructor: randomString, nonce: "1"};

    let state = serializeState({transactionNo: transactionNo});
    console.log('this is the start state: ', state);

    //callback function called upon state change that returns true if state is valid
    const stateValidator = function (state) {

        state = deserializeState(state);
        // console.log('deserialized state: ', state);
        transactionNo = state.transactionNo;
        transactionNo++;
        state = serializeState({transactionNo: transactionNo});
        // console.log('state serialized again: ', state);

        console.log('transactionNo: ', transactionNo);

        client.sendState(sessionID, opponentAddress, state);

        return true;
    };
    sessionID = await client.createAppSession(appInfo, stateValidator);
    console.log('sessionID: ', sessionID);
    
    //sendState(sessionID: string, destination: string, state: Uint8Array): Promise<void>
    // await client.sendState(sessionID, opponentAddress, state);

    // const balanceBefore = await client.getEthBalance(); //offchain balance
    // console.log('balance before', balanceBefore);
    // await client.sendEth(betAmount, playerAddress);
    // await timeout(1000); //100 also works
    // const balanceAfter = await client.getEthBalance();

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

//have two copies of client so can run locally
//open channel with server 
//create app session (returns unique global session ID)
//send state (with session ID and serialized game state)
//if lost send money