const HqSignHandler = require('../HqSignHandler');

async function testSign() {
    let signature = await HqSignHandler.handleSignature(2,'0x0000000000000000000000000000000000000000','0xCbd2eAe05Cc82Ad407DFe31e8d4a97e254AF1749','99999999',2);
    console.log('signature:',signature);
}
async function testAll(params) {
    await testSign();
}
testAll();