import { api, TIMEOUT_MS, ACTOR, PERMISSION, ACCOUNT, CONCURRENCY, ACTION } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import PQueue from 'p-queue';

function mine( ): Action {
    return {
        account: ACCOUNT,
        name: ACTION,
        authorization: [{actor: ACTOR, permission: PERMISSION}],
        data: {
            executor: ACTOR,
            nonce: Math.floor(Math.random() * 10000)
        }
    };
};

async function task(queue: PQueue<any, any> ) {
    await transact(api, [ mine() ]);
    await timeout(TIMEOUT_MS);
    queue.add(() => task(queue));
}

(async () => {
    const queue = new PQueue({concurrency: CONCURRENCY});
    for ( let i = 0; i <= CONCURRENCY; i++ ) {
        queue.add(() => task(queue));
        await timeout(TIMEOUT_MS);
    }
    await queue.onIdle();
})();
