import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
const { TextEncoder, TextDecoder } = require('util');
require("dotenv").config();

const signatureProvider = new JsSignatureProvider(process.env.PRIVATE_KEYS.split(","));
export const rpc = new JsonRpc(process.env.NODEOS_ENDPOINT, { fetch: require('node-fetch') });
export const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// miner configurations
export const ACTOR = process.env.ACTOR;
export const PERMISSION = process.env.PERMISSION || "active";

export const EXT_QUANTITY = (process.env.EXT_QUANTITY || "5.0000 EOS@eosio.token").split(",").map(row => row.split("@"));
