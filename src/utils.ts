import { RpcError, Api } from "eosjs";
import { Action } from "eosjs/dist/eosjs-serialize";
import { apis } from "./config"

let init = new Date().getTime();
let lastSuccess = 0;
let count = 0;

let refBlockTime = 0;
let trxExpiration = "";
let refBlockInfo : any;
const status = new Array(apis.length).fill(null).map(() => ({ success: 0, fails: 0, errors: 0, lastValid: new Date()}));

/**
 * Transaction
 */
export async function transact(api: Api, actions: Action[], worker: number): Promise<string> {
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
        if ( start - refBlockTime > 20*1000) {
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
        status[worker].success++;
        status[worker].lastValid = new Date();
        lastSuccess = new Date().getTime();

        for (const action of actions) {
            console.log(`[${worker}] ${ms} [${count_b}/b] ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${trx_id}`);
        }
    } catch (e) {
        if (e instanceof RpcError) {
            const end = new Date().getTime();
            const {name, what, details} = e.json.error
            const message = (details[0]) ? details[0].message.replace("assertion failure with message", "Fail") : `[${name}] ${what}`;
            const ms = (end - start) + "ms";
            status[worker].fails++;
            status[worker].lastValid = new Date();
            const since = lastSuccess==0 ? "--s" : timeSince(new Date().getTime() - lastSuccess);

            for (const action of actions) {
                console.error(`[${worker}-${status[worker].fails}/${status[worker].success}/${status[worker].errors}/${since}] ${ms} [${count_b}/b] ${action.name} [${JSON.stringify(action.data)}] => ${message}`);
            }
        } else {
            const msSinceValid = new Date().getTime() - status[worker].lastValid.getTime();
            console.error( `[${worker}-${status[worker].fails}/${status[worker].success}/${status[worker].errors}] ❌ ERROR with RPC endpoint: ${api.rpc.endpoint}. Sleeping ${(5000 + msSinceValid)/1000} seconds` );
            status[worker].errors++;
            await timeout(5000 + msSinceValid);  //sleep 5 seconds, 10 seconds, 15 seconds, 20 seconds, etc
        }
    }

    return trx_id;
}

export function timeout( ms: number ): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), ms ))
}

function timeSince(ms: number): string {

    let seconds = Math.floor(ms / 1000);
    let str = "";
    if (Math.floor(seconds / 3600)) {
      str = Math.floor(seconds / 3600) + "h";
    }
    if (Math.floor(seconds / 60)) {
      str = str + Math.floor(seconds / 60) % 60 + "m";
    }
    str = str + Math.floor(seconds % 60) + "s";
    return str;
  }