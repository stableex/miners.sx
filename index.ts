import { api, TIMEOUT_MS, ACTOR, PERMISSION, QUANTITY, CONCURRENCY } from "./src/config"
import { timeout, transact } from "./src/utils"
import { Action } from "eosjs/dist/eosjs-serialize";
import PQueue from 'p-queue';

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

async function task(action: Action, queue: PQueue<any, any> ) {
    await transact(api, [ action ]);
    await timeout(TIMEOUT_MS);
    queue.add(() => task(action, queue));
}

(async () => {
    const queue = new PQueue({concurrency: CONCURRENCY});

    // // miner.sx
    // queue.add(() => task(miner(), queue));

    for ( let i = 0; i <= CONCURRENCY; i++ ) {
        for ( const [quantity, contract] of QUANTITY ) {

            // basic.sx
            queue.add(() => task(basic(quantity, contract), queue));
            await timeout(TIMEOUT_MS);
        }
    }
    await queue.onIdle();
})();
