import { api, ACTOR, PERMISSION, QUANTITY } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import { CronJob } from "cron"

function basic( quantity: string, contract: string ): Action {
    return {
        account: "basic.sx",
        name: "mine",
        authorization: [{actor: ACTOR, permission: PERMISSION}],
        data: {
            executor: ACTOR,
            ext_quantity: {
                quantity,
                contract,
            },
            nonce: Math.floor(Math.random() * 10000)
        }
    };
};


function gravy( ): Action {
    return {
        account: "gravyhftdefi",
        name: "mine",
        authorization: [{actor: ACTOR, permission: PERMISSION}],
        data: {
            miner: ACTOR,
            symbol: "8,GRV",
            rando: Math.floor(Math.random() * 10000)
        }
    };
};

function miner( ): Action {
    return {
        account: "miner.sx",
        name: "mine",
        authorization: [{actor: ACTOR, permission: PERMISSION}],
        data: {
            executor: ACTOR
        }
    };
};

new CronJob("* * * * * *", async () => {
    let count = 20;
    // miner.sx
    transact(api, [ miner() ]);

    while ( count > 0 ) {
        count -= 1;
        for ( const [quantity, contract] of QUANTITY ) {
            // basic.sx
            transact(api, [ basic(quantity, contract) ]);

            // gravy
            transact(api, [ gravy() ]);
        }
        await timeout(25);
    }
}, null, true).fireOnTick();