import { api, CONTRACT, ACTOR, PERMISSION, EXT_QUANTITY } from "./src/config"
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

new CronJob("* * * * * *", async () => {
    let count = 10;
    while ( count > 0 ) {
        count -= 1;
        for ( const [quantity, contract] of EXT_QUANTITY ) {
            transact(api, [ basic(quantity, contract) ]);
        }
        await timeout(25);
    }
}, null, true).fireOnTick();
