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
            }
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
    let count = 10;
    // miner.sx
    transact(api, [ miner() ]);

    while ( count > 0 ) {
        count -= 1;
        for ( const [quantity, contract] of QUANTITY ) {
            // basic.sx
            transact(api, [ basic(quantity, contract) ]);
        }
        await timeout(25);
    }
}, null, true).fireOnTick();