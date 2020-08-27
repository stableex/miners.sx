#!/bin/bash

eosio-cpp miner.sx.cpp -I ../
cleos set contract miner.sx . miner.sx.wasm miner.sx.abi
