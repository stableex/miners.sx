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

    [[eosio::action]]
    void one();

    [[eosio::action]]
    void two();

    [[eosio::action]]
    void three( const name contract, const asset quantity );

    [[eosio::action]]
    void four( const string memo );

    using mine_action = eosio::action_wrapper<"mine"_n, &minerSx::mine>;
    using one_action = eosio::action_wrapper<"one"_n, &minerSx::one>;
    using two_action = eosio::action_wrapper<"two"_n, &minerSx::two>;
    using three_action = eosio::action_wrapper<"three"_n, &minerSx::three>;
    using four_action = eosio::action_wrapper<"four"_n, &minerSx::four>;

    // static actions
    static void repay( const name contract, const asset quantity )
    {
        transfer( "miner.sx"_n, "flash.sx"_n, contract, quantity, "miner" );
    }

    static void borrow( const name contract, const asset quantity, const string executor )
    {
        flash::borrow_action borrow( "flash.sx"_n, { "miner.sx"_n, "active"_n });
        borrow.send( "miner.sx"_n, contract, quantity, executor, "miner.sx"_n );
    }

    static void transfer( const name from, const name to, const name contract, const asset quantity, const string memo )
    {
        token::transfer_action transfer( contract, { "miner.sx"_n, "active"_n });
        transfer.send( from, to, quantity, memo );
    }
};
