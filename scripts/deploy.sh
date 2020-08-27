#!/bin/bash

# unlock wallet
cleos wallet unlock --password $(cat ~/eosio-wallet/.pass)

# create accounts
cleos create account eosio sx EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio miner.sx EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

# deploy
cleos set contract miner.sx . miner.sx.wasm miner.sx.abi

# permission
cleos set account permission miner.sx active --add-code

# open token balances
cleos push action eosio.token open '["miner.sx", "4,EOS", "miner.sx"]' -p miner.sx
cleos push action tethertether open '["miner.sx", "4,USDT", "miner.sx"]' -p miner.sx
