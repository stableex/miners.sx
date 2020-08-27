#include <eosio.token/eosio.token.hpp>
#include <sx.flash/flash.sx.hpp>

#include "miner.sx.hpp"

[[eosio::action]]
void minerSx::mine( const name executor )
{
    require_auth( executor );

    const asset quantity = asset{100'0000, symbol{"EOS", 4}};
    const name contract = "eosio.token"_n;
    borrow( contract, quantity, executor.to_string() );
}

// Defibox pairs
// 9 = EOS/USN
// 12 = EOS/USDT
// 35 = USN/USDT
// 194 = EOS/BOX

[[eosio::on_notify("flash.sx::callback")]]
void minerSx::on_callback( const name to, const name contract, asset quantity, const string memo, const name recipient )
{
    minerSx::one_action one( get_self(), { get_self(), "active"_n });
    minerSx::two_action two( get_self(), { get_self(), "active"_n });
    minerSx::three_action three( get_self(), { get_self(), "active"_n });
    minerSx::four_action four( get_self(), { get_self(), "active"_n });

    transfer( get_self(), "swap.defi"_n, contract, quantity / 2, "swap,0,9" );
    transfer( get_self(), "swap.defi"_n, contract, quantity / 2, "swap,0,9" );
    one.send();
    two.send();
    three.send( contract, quantity );
    four.send( memo );
}

[[eosio::action]]
void minerSx::one()
{
    require_auth( get_self() );

    const name contract = "danchortoken"_n;
    const asset balance = token::get_balance( contract, get_self(), symbol_code{"USN"} );
    check( balance.amount > 0, "error in step 1");
    transfer( get_self(), "swap.defi"_n, contract, balance, "swap,0,9" );
}

[[eosio::action]]
void minerSx::two()
{
    require_auth( get_self() );

    const name contract = "token.defi"_n;
    const asset balance = token::get_balance( contract, get_self(), symbol_code{"BOX"} );
    check( balance.amount >= 1, "no BOX tokens");
    transfer( get_self(), "swap.defi"_n, contract, balance, "swap,0,194" );
}

void minerSx::three( const name contract, const asset quantity )
{
    require_auth( get_self() );

    const asset balance = token::get_balance( contract, get_self(), quantity.symbol.code() );
    const asset remaining = balance - quantity;
    check( remaining.amount >= 0, "cannot repay flashloan by " + remaining.to_string() );
    transfer( "miner.sx"_n, "flash.sx"_n, contract, quantity, "repay" );
}

void minerSx::four( const string memo )
{
    require_auth( get_self() );

    const name contract = "eosio.token"_n;
    const asset balance = token::get_balance( contract, get_self(), symbol_code{"EOS"} );
    check( balance.amount >= 1, "profit must exceed 0.0001 EOS");
    transfer( get_self(), "fee.sx"_n, contract, balance, memo );
}
