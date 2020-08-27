#pragma once

#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

using namespace eosio;
using namespace std;

class [[eosio::contract("miner.sx")]] minerSx : public contract {
public:
    using contract::contract;

    [[eosio::action]]
    void mine( const name executer );

    [[eosio::on_notify("flash.sx::callback")]]
    void on_callback( const name to, const name contract, asset quantity, const string memo, const name recipient );

    // static actions
    static void repay( const name contract, const asset quantity )
    {
        transfer( "miner.sx"_n, "flash.sx"_n, contract, quantity, "miner" );
    }

    static void borrow( const name contract, const asset quantity )
    {
        flash::borrow_action borrow( "flash.sx"_n, { "miner.sx"_n, "active"_n });
        borrow.send( "miner.sx"_n, contract, quantity, "miner", "miner.sx"_n );
    }

    static void transfer( const name from, const name to, const name contract, const asset quantity, const string memo )
    {
        token::transfer_action transfer( contract, { "miner.sx"_n, "active"_n });
        transfer.send( from, to, quantity, memo );
    }
};
