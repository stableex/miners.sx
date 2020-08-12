import { api, ACTOR, PERMISSION } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import { CronJob } from "cron"

const action: Action = {
    account: "miner.sx",
    name: "mine",
    authorization: [{actor: ACTOR, permission: PERMISSION}],
    data: {
        executer: ACTOR,
    }
};

new CronJob("* * * * * *", async () => {
    let count = 10;
    while ( count > 0 ) {
        count -= 1;
        await timeout(50);
        transact(api, [action]);
    }
}, null, true).fireOnTick();
