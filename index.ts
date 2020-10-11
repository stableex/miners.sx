import { api, ACTOR, PERMISSION, QUANTITY } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import { CronJob } from "cron"

function action( eos_tokens: string): Action {
    return {
        account: "basic.sx",
        name: "mine",
        authorization: [{actor: ACTOR, permission: PERMISSION}],
        data: {
            executor: ACTOR,
            eos_tokens
        }
    };
};

new CronJob("* * * * * *", async () => {
    let count = 10;
    while ( count > 0 ) {
        count -= 1;
        for ( const quantity of QUANTITY ) {
            transact(api, [ action(quantity) ]);
        }
        await timeout(25);
    }
}, null, true).fireOnTick();
