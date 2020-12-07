import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
require("dotenv").config();

// REQUIRED configurations
if (!process.env.ACTOR) throw new Error("process.env.ACTOR is required");
if (!process.env.PRIVATE_KEYS) throw new Error("process.env.PRIVATE_KEYS is required");
export const ACTOR = process.env.ACTOR;

// OPTIONAL configurations
export const NODEOS_ENDPOINT = process.env.NODEOS_ENDPOINT || "http://localhost:8888"
export const PERMISSION = process.env.PERMISSION || "active";
export const CPU_PERMISSION = process.env.CPU_PERMISSION || PERMISSION;
export const CPU_ACTOR = process.env.CPU_ACTOR || ACTOR;
export const CONCURRENCY = Number(process.env.CONCURRENCY || 3);
export const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 5);
export const ACCOUNT = process.env.ACCOUNT || "push.sx";
export const AUTHORIZATION = ACTOR == CPU_ACTOR ? [{actor: ACTOR, permission: PERMISSION}] : [{actor: CPU_ACTOR, permission: CPU_PERMISSION}, {actor: ACTOR, permission: PERMISSION}];

// EOSIO RPC & API
const signatureProvider = new JsSignatureProvider(process.env.PRIVATE_KEYS.split(","));
export const rpc = new JsonRpc(NODEOS_ENDPOINT, { fetch });
export const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
