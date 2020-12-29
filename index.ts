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

async function start( worker: number ) {
    const queue = new PQueue({concurrency: CONCURRENCY});
    for ( let i = 0; i < CONCURRENCY; i++ ) {
        queue.add(() => task(queue, worker));
        await timeout(TIMEOUT_MS);
    }
    await queue.onIdle();
};

async function validate () {
    // check RPC connections
    const valid_connections = new Map<string, true>();
    while ( valid_connections.size < apis.length ) {
        for ( const api of apis ) {
            const rpc = api.rpc;
            // skip if valide
            if ( valid_connections.has( rpc.endpoint )) continue;
            try {
                // RPC endpoint must be able to respond
                await rpc.get_info();
                valid_connections.set(rpc.endpoint, true);
                console.error( "✅ OK endpoint:", rpc.endpoint );
            } catch (e) {
                console.error( "❌ ERROR with RPC endpoint:", rpc.endpoint );
                await timeout(5000);
            }
        }
    }
}

async function boot() {
    await validate();

    // initiate workers
    for ( let worker = 0; worker < apis.length; worker++ ) {
        console.error( "🤖 inititate woker", worker );
        start( worker );
    }
}

boot();