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
export const NODEOS_ENDPOINTS = process.env.NODEOS_ENDPOINTS || "http://localhost:8888"
export const CPU_ACTOR = process.env.CPU_ACTOR || ACTOR;
export const CONCURRENCY = Number(process.env.CONCURRENCY || 5);
export const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 10);
export const ACCOUNT = process.env.ACCOUNT || "push.sx";
export const AUTHORIZATION = parse_authorization([ CPU_ACTOR, ACTOR ]);

// validate .env settings
if (CPU_ACTOR.match(/[<>]/)) throw new Error("process.env.CPU_ACTOR is invalid");
if (ACTOR.match(/[<>]/)) throw new Error("process.env.ACTOR is invalid");
if (process.env.PRIVATE_KEYS.match(/[<>]/)) throw new Error("process.env.PRIVATE_KEYS is invalid");

// EOSIO RPC & API
const signatureProvider = new JsSignatureProvider(process.env.PRIVATE_KEYS.split(","));
export const apis = NODEOS_ENDPOINTS.split(",").map(endpoint => {
    const rpc = new JsonRpc(endpoint, { fetch });
    return new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
});

function parse_authorization( authorizations: string[] ) {
    const exists = new Set<string>();
    const permissions = [];
    for ( const authorization of authorizations ) {
        if (!authorization) continue;
        const [actor, permission ] = authorization.split("@");
        if (exists.has( actor )) continue; // prevent duplicates
        permissions.push({ actor, permission: permission || "active" });
        exists.add( actor );
    }
    return permissions;
}