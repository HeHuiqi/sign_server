const Koa = require('koa');
const route = require('koa-route');
const HqSignHandler = require('./HqSignHandler');
const app = new Koa();

function parseQuery(querystring){
    let res = {};
    let params = querystring.split('&');
    for (let i = 0; i < params.length; i++) {
        const kvs = params[i];
        const kv = kvs.split('=');
        res[kv[0]] = kv[1];
    }
    console.log('params:',res);
    return res;
}
const sign = async (ctx)=>{

    const contentType = 'application/json; chartset=utf-8'
    ctx.set('Content-Type', contentType)
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

    if (ctx.request.path == '/sign') {
        let ps = parseQuery(ctx.request.querystring);
        if (ps.collateralId && ps.token && ps.marketAddress && ps.expiration && ps.chainId ) {
            const rspData = {
                code:1,
                msg:'success',
                data:{}
            };
            try {
                const signature = await  HqSignHandler.handleSignature(ps.collateralId,ps.token,ps.marketAddress,ps.expiration,ps.chainId);
                console.log('signature:',signature);
                rspData.data = {signature};
            } catch (error) {
                rspData.code = 2;
                rspData.msg = '签名过程异常'
            }
            ctx.response.body = JSON.stringify(rspData);
        }else{
            ctx.response.body = '参数错误';
        } 
    }else{
        ctx.response.body = 'Not Found';
    }
};

const  home = (ctx)=> {
    ctx.response.body = '<h1>Welcome Sign Server!</h1>';
}
let PORT = 3000;
async function main() {
    console.log('http://127.0.0.1:'+PORT);
    // parseQuery('collateralId=2&token=0x0000000000000000000000000000000000000000&marketAddress=0xCbd2eAe05Cc82Ad407DFe31e8d4a97e254AF1749&expiration=99999999&chainId=2');
    app.use(route.get('/sign',sign));
    app.use(route.get('/',home));
    app.listen(PORT);
}

main();
