import { RpcError, Api } from "eosjs";
import { Action } from "eosjs/dist/eosjs-serialize";

let init = new Date().getTime();
let count = 0;

/**
 * Transaction
 */
export async function transact(api: Api, actions: Action[]): Promise<string> {
    // start time when transaction request
    const start = new Date().getTime();
    let trx_id: string;

    // calculate aggregated transaction count per minute
    count ++;
    const count_m = Math.floor(count / ((start - init) / 1000 ) * 60);

    // reset init timer if exceeds 1 hour
    if ( start - init > 3600000 ) {
        init = new Date().getTime();
        count = 0;
    }

    try {
        const result = await api.transact({actions}, { blocksBehind: 3, expireSeconds: 30 });
        trx_id = result.transaction_id;
        const end = new Date().getTime();
        const ms = (end - start) + "ms";

        for (const action of actions) {
            console.log(`${ms} [${count_m}/m] ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${trx_id}`);
        }
    } catch (e) {
        if (e instanceof RpcError) {
            const end = new Date().getTime();
            const {name, what, details} = e.json.error
            const message = (details[0]) ? details[0].message : `[${name}] ${what}`;
            const ms = (end - start) + "ms";

            for (const action of actions) {
                console.error(`${ms} [${count_m}/m] ERROR ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${message}`);
            }
        } else {
            console.error(e);
        }
    }
    return trx_id;
}

export function timeout( ms: number ): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), ms ))
}
