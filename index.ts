import { api, TIMEOUT_MS, ACTOR, PERMISSION, ACCOUNT, CONCURRENCY, ACTION, TYPE, AUTHORIZATION } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import PQueue from 'p-queue';

function sx( ): Action {
    return {
        account: ACCOUNT,
        name: ACTION,
        authorization: AUTHORIZATION,
        data: {
            executor: ACTOR,
            nonce: Math.floor(Math.random() * 10000)
        }
    };
};

function gravy( ): Action {
    return {
        account: "gravyhftdefi",
        name: "mine",
        authorization: AUTHORIZATION,
        data: {
            miner: ACTOR,
            symbol: "8,GRV",
            rando: Math.floor(Math.random() * 10000)
        }
    };
};

function sapex( ): Action {
    return {
        account: "sapexfund.eo",
        name: "move",
        authorization: AUTHORIZATION,
        data: {}
    };
};

const actions = {
    sx,
    gravy,
    sapex,
}

async function task(queue: PQueue<any, any> ) {
    await transact(api, [ actions[TYPE]() ]);
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
