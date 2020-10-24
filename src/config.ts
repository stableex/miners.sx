import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
const { TextEncoder, TextDecoder } = require('util');
require("dotenv").config();

const signatureProvider = new JsSignatureProvider(process.env.PRIVATE_KEYS.split(","));
export const rpc = new JsonRpc(process.env.NODEOS_ENDPOINT, { fetch: require('node-fetch') });
export const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// miner configurations
if (!process.env.ACTOR) throw new Error("process.env.ACTOR is required");
if (!process.env.QUANTITY) throw new Error("process.env.QUANTITY is required");
if (!process.env.QUANTITY.includes("@")) throw new Error("process.env.QUANTITY schema is invalid (ex: \"1.0000 EOS@eosio.token\")");

export const ACTOR = process.env.ACTOR;
export const PERMISSION = process.env.PERMISSION || "active";
export const QUANTITY = process.env.QUANTITY.split(",").map(row => row.split("@"));
export const CONCURRENCY = Number(process.env.CONCURRENCY || 20);
export const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 50);