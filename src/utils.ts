import { RpcError, Api } from "eosjs";
import { Action } from "eosjs/dist/eosjs-serialize";

/**
 * Transaction
 */
export async function transact(api: Api, actions: Action[]): Promise<string> {
    const start = new Date().getTime();
    let trx_id: string;
    try {
        const result = await api.transact({actions}, { blocksBehind: 3, expireSeconds: 30 });
        trx_id = result.transaction_id;
        const end = new Date().getTime();
        const ms = (end - start) + "ms";

        for (const action of actions) {
            console.log(`${ms} ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${trx_id}`);
        }
    } catch (e) {
        if (e instanceof RpcError) {
            const end = new Date().getTime();
            const {name, what, details} = e.json.error
            const message = (details[0]) ? details[0].message : `[${name}] ${what}`;
            const ms = (end - start) + "ms";

            for (const action of actions) {
                console.error(`${ms} ERROR ${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${message}`);
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
