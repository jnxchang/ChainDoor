const EVT = require("evtjs");
const privateKey = "";
const publicKey = EVT.EvtKey.privateToPublic(privateKey); // 
const url = require("url");

console.log(publicKey);

module.exports = class ActionExecutor {
    async pushPay(evtLink, sym, amount, node) {
        try {
            console.log("request:" + new Date().getTime());

            let nodeUrl = url.parse(node);

            const endpoint = {
                host: nodeUrl.hostname,
                port: nodeUrl.port || 443,                     
                protocol: nodeUrl.protocol.replace(":", "")
            };

            const apiCaller = EVT({
                endpoint,
                keyProvider: privateKey
            });

            let ret = await apiCaller.pushTransaction(
                { maxCharge: 200000 },
                new EVT.EvtAction(
                    "everipay",
                    {
                        link: evtLink,
                        "payee": publicKey,
                        "number": amount + " S#" + sym
                    }
                )
            );

            console.log("end:" + new Date().getTime());

            return ret;
        }
        catch (e) {
            return { error: e };
        }
    }
};
