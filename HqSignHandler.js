const ethers = require('ethers');
const HqConfig = require('./HqConfig');
function signerWallet(privateKey) {
    let myWallet = new ethers.Wallet(privateKey);
    return myWallet;
}
function messageHash(types,values) {
    // const hash = hre.ethers.utils.solidityKeccak256(types,values);
    const msg_hash = ethers.utils.defaultAbiCoder.encode(types,values);
    // const msg_hash = hre.ethers.utils.solidityPack(types,values);
    const hash = ethers.utils.keccak256(msg_hash);
    let messageBytes = ethers.utils.arrayify(hash);
    // console.log("Message Hash: ", messageBytes);
    return messageBytes;
}

async function localSignMessage(messageBytes) {
    const wallet = signerWallet(HqConfig.signer.privateKey);
    const signature = await wallet.signMessage(messageBytes);
    return signature;
}


async function handleSignature(collateralId,token,marketAddress,expiration,chainId) {
    const hash = messageHash(['uint256','address','address','uint256','uint256'],
    [collateralId,token,marketAddress,expiration,chainId]);
    let signature = await localSignMessage(hash);
    // console.log('signature:',signature);
    return signature;
}


const HqSignHandler = {
    handleSignature
}
module.exports = HqSignHandler;