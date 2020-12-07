import { get_api, TIMEOUT_MS, ACTOR, ACCOUNT, CONCURRENCY, AUTHORIZATION } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import PQueue from 'p-queue';

function mine( ): Action {
    return {
        account: ACCOUNT,
        name: "mine",
        authorization: AUTHORIZATION,
        data: {
            executor: ACTOR,
            nonce: Math.floor(Math.random() * 10000)
        }
    };
};

async function task(queue: PQueue<any, any> ) {
    const api = get_api();
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
