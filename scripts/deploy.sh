#!/bin/bash

# unlock wallet
cleos wallet unlock --password $(cat ~/eosio-wallet/.pass)

# create accounts
cleos create account eosio sx EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio miner.sx EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio myaccount EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio tethertether EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio eosio.token EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

# deploy
cleos set contract miner.sx . miner.sx.wasm miner.sx.abi
cleos set contract eosio.token . eosio.token.wasm eosio.token.abi
cleos set contract tethertether . eosio.token.wasm eosio.token.abi

# permission
cleos set account permission miner.sx active --add-code

# create SX
cleos push action eosio.token create '["eosio", "100000000.0000 EOS"]' -p eosio.token
cleos push action eosio.token issue '["eosio.token", "5000000.0000 EOS", "init"]' -p eosio
cleos transfer eosio myaccount "50000.0000 EOS" "init" --contract eosio

# create USDT
cleos push action tethertether create '["tethertether", "100000000.0000 USDT"]' -p tethertether
cleos push action tethertether issue '["tethertether", "5000000.0000 USDT", "init"]' -p tethertether
cleos transfer tethertether miner.sx "50000.0000 USDT" "miner.sx" --contract tethertether
