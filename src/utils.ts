import { RpcError, Api } from "eosjs";
import { Action } from "eosjs/dist/eosjs-serialize";

let init = new Date().getTime();
let count = 0;

let refBlockTime = 0;
let trxExpiration = "";
let refBlockInfo : any;

/**
 * Transaction
 */
export async function transact(api: Api, actions: Action[]): Promise<string> {
    // start time when transaction request
    const start = new Date().getTime();
    let trx_id: string;

    // calculate aggregated transaction count per block
    count ++;
    const count_b = Math.floor(count / ((start - init) / 500 ));

    // reset init timer if exceeds 5 minutes
    if ( start - init > 300000 ) {
        init = new Date().getTime();
        count = 0;
    }

    try {

        // refresh TAPOS params every 20 seconds
        if( start - refBlockTime > 20*1000) {
            refBlockTime = start;
            const info = await api.rpc.get_info();
            refBlockInfo = await api.rpc.get_block(info.head_block_num - 3);
            const timeInISOString = (new Date(refBlockTime + 40*1000)).toISOString();      //expiration in 40 seconds
            trxExpiration = timeInISOString.substr(0, timeInISOString.length - 1);
        }

        //first transact has to be made with blocksBehind
        const result = refBlockInfo ?
            await api.transact({
                expiration: trxExpiration,
                ref_block_num: refBlockInfo.block_num & 0xffff,
                ref_block_prefix: refBlockInfo.ref_block_prefix,
                actions: actions
            }) :
            await api.transact({actions}, { blocksBehind: 3, expireSeconds: 30 });

        trx_id = result.transaction_id;
        const end = new Date().getTime();
        const ms = (end - start) + "ms";

        for (const action of actions) {
            console.log(`${ms} [${count_b}/b] ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${trx_id}`);
        }
    } catch (e) {
        if (e instanceof RpcError) {
            const end = new Date().getTime();
            const {name, what, details} = e.json.error
            const message = (details[0]) ? details[0].message : `[${name}] ${what}`;
            const ms = (end - start) + "ms";

            for (const action of actions) {
                console.error(`${ms} [${count_b}/b] ERROR ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${message}`);
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
