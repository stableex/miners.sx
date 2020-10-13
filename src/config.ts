import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
const { TextEncoder, TextDecoder } = require('util');
require("dotenv").config();

const signatureProvider = new JsSignatureProvider(process.env.PRIVATE_KEYS.split(","));
export const rpc = new JsonRpc(process.env.NODEOS_ENDPOINT, { fetch: require('node-fetch') });
export const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// miner configurations
if (!process.env.ACTOR) throw new Error("process.env.ACTOR is required");
if (!process.env.EXT_QUANTITY) throw new Error("process.env.EXT_QUANTITY is required");
if (!process.env.CONTRACT) throw new Error("process.env.CONTRACT is required");

export const ACTOR = process.env.ACTOR;
export const CONTRACT = process.env.CONTRACT;
export const PERMISSION = process.env.PERMISSION || "active";
export const EXT_QUANTITY = process.env.EXT_QUANTITY.split(",").map(row => row.split("@"));
