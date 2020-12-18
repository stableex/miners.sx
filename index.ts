import { apis, TIMEOUT_MS, ACTOR, ACCOUNT, CONCURRENCY, AUTHORIZATION } from "./src/config"
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

async function task(queue: PQueue<any, any>, worker: number ) {
    await transact(apis[worker], [ mine() ], worker);
    await timeout(TIMEOUT_MS);
    queue.add(() => task(queue, worker));
}

for ( let worker = 0; worker < apis.length; worker++ ) {
    (async () => {
        const queue = new PQueue({concurrency: CONCURRENCY});
        for ( let i = 0; i < CONCURRENCY; i++ ) {
            queue.add(() => task(queue, worker));
            await timeout(TIMEOUT_MS);
        }
        await queue.onIdle();
    })();
}