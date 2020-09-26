import { api, ACTOR, PERMISSION } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import { CronJob } from "cron"

function action( symcode: string): Action {
    return {
        account: "miner.sx",
        name: "mine",
        authorization: [{actor: ACTOR, permission: PERMISSION}],
        data: {
            executor: ACTOR,
            symcode
        }
    };
};

new CronJob("* * * * * *", async () => {
    let count = 10;
    while ( count > 0 ) {
        count -= 1;
        transact(api, [ action("EOS") ]);
        transact(api, [ action("USDT") ]);
        await timeout(50);
    }
}, null, true).fireOnTick();
