const Koa = require('koa');
const Router = require('koa-router');

const ActionExecutor = require("./executor");
const actionExecutor = new ActionExecutor();
const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
    try { 
        console.log(new Date().getTime());
        let code = ctx.request.query.code;
        
        let ret = await actionExecutor.pushPay(code, ctx.request.query.sym, ctx.request.query.amount, ctx.request.query.node || "http://www.baidu.com");
        console.log(ret);

        if (ret.transactionId) {
            ctx.body = ret.transactionId;
            console.log(new Date().getTime());
            return;
        }

        ctx.body = "ERR" + ret.error.message;
        console.log(new Date().getTime());
    }
    catch (e) {
        console.log(e);
        ctx.body = e.message;
    }
});

router.get('/link', async (ctx, next) => {
    const EVT = require("evtjs");
    let link = await EVT.EvtLink.getEvtLinkForEveriPay({
        symbol: 1,
        maxAmount: 100,
        linkId: await EVT.EvtLink.getUniqueLinkId(),
        keyProvider: [ "5JyuVEopqzrMxqYP6eLCtEFGeWxkKcSmrAoMfyxmvakZDKoGrqY" ]
    });

    ctx.body = link.rawText;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
