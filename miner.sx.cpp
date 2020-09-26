#include <eosio.token/eosio.token.hpp>
#include <sx.flash/flash.sx.hpp>
#include <sx.swap/swap.sx.hpp>

#include "defibox.hpp"
#include "dfs.hpp"
// #include "swap.sx.hpp"
#include "miner.sx.hpp"

[[eosio::action]]
void minerSx::mine( const name executor, const optional<symbol_code> symcode )
{
    require_auth( executor );

    asset quantity = asset{100'0000, symbol{"EOS", 4}};
    name contract = "eosio.token"_n;

    if ( *symcode == symbol_code{"USDT"} ) {
        asset quantity = asset{50'0000, symbol{"USDT", 4}};
        name contract = "tethertether"_n;
    }

    flash::borrow_action borrow( "flash.sx"_n, { get_self(), "active"_n });
    borrow.send( get_self(), contract, quantity, executor.to_string(), get_self() );
}

[[eosio::on_notify("flash.sx::callback")]]
void minerSx::on_callback( const name to, const name contract, asset quantity, const string memo, const name recipient )
{
    // static actions
    minerSx::repay_action repay( get_self(), { get_self(), "active"_n });
    minerSx::profit_action profit( get_self(), { get_self(), "active"_n });
    minerSx::rewards_action rewards( get_self(), { get_self(), "active"_n });

    // miner actions
    if ( quantity.symbol.code() == symbol_code{"EOS"} ) {
        box_swap_arb( contract, quantity );
        rewards.send( "194" );
    }
    if ( quantity.symbol.code() == symbol_code{"USDT"} ) {
        sx_to_defibox( contract, quantity );
        rewards.send( "194-12" );
    }

    // repay flash loan
    repay.send( contract, quantity );

    // send profits to fee.sx
    profit.send( contract, quantity.symbol.code() );
}

// EOS/USN = 9 (Defibox) - swap.defi
// EOS/USDT = 12 (Defibox) - swap.defi
// USN/USDT = 35 (Defibox) - swap.defi
// EOS/BOX = 194 (Defibox) - swap.defi
// EOS/USDT = 17 (DFS) - defisswapcnt
bool minerSx::defibox_to_dfs( const asset quantity, const uint8_t pair_id, const uint8_t mid )
{
    const asset defibox_quantity = defibox::getAmountOut( quantity, pair_id );
    const asset dfs_quantity = dfs::getAmountOut( defibox_quantity, mid );
    const asset delta = dfs_quantity - quantity;

    if ( delta.amount > 0 ) {
        transfer( get_self(), "swap.defi"_n, "eosio.token"_n, quantity, "swap,0," + to_string(pair_id) );
        transfer( get_self(), "defisswapcnt"_n, "tethertether"_n, defibox_quantity, "swap:" + to_string(mid) );
        return true;
    }
    return false;
}

// USN/USDT = 35 (Defibox) - swap.defi
bool minerSx::sx_to_defibox( const name contract, const asset quantity )
{
    const uint8_t pair_id = 35;
    const asset sx_quantity = swapSx::get_rate("stable.sx"_n, quantity, symbol_code{"USN"} );
    const asset defibox_quantity = defibox::getAmountOut( quantity, pair_id );
    const asset delta = defibox_quantity - quantity;

    if ( delta.amount > 0 ) {
        transfer( get_self(), "stable.sx"_n, "tethertether"_n, quantity, "USN" );
        transfer( get_self(), "swap.defi"_n, "danchortoken"_n, sx_quantity, "swap,0," + to_string(pair_id) );
        return true;
    }
    check( delta.amount > 0, delta.to_string() + " delta | " + sx_quantity.to_string() + " sx | " + defibox_quantity.to_string() + " defibox");
    return false;
}

void minerSx::box_swap_arb( const name contract, const asset quantity )
{
    // swap EOS => BOX => EOS
    transfer( get_self(), "swap.defi"_n, contract, quantity, "swap,0,194" );
    minerSx::rewards_action rewards( get_self(), { get_self(), "active"_n });
    rewards.send( "194" );
}

[[eosio::action]]
void minerSx::rewards( const string pair_id )
{
    require_auth( get_self() );

    // BOX swap rewards
    const name contract = "token.defi"_n;
    const asset balance = token::get_balance( contract, get_self(), symbol_code{"BOX"} );
    if ( balance.amount ) transfer( get_self(), "swap.defi"_n, contract, balance, "swap,0," + pair_id );
}

[[eosio::action]]
void minerSx::profit( const name contract, const symbol_code symcode )
{
    require_auth( get_self() );

    const asset balance = token::get_balance( contract, get_self(), symcode );
    check( balance.amount >= 1, "profit must exceed " + asset{1, balance.symbol }.to_string() );
    transfer( get_self(), "fee.sx"_n, contract, balance, "miner.sx" );
}

void minerSx::repay( const name contract, const asset quantity )
{
    require_auth( get_self() );

    const asset balance = token::get_balance( contract, get_self(), symbol_code{"EOS"} );
    const asset remaining = balance - quantity;
    check( remaining.amount >= 0, "cannot pay flashloan by " + remaining.to_string() );
    transfer( get_self(), "flash.sx"_n, contract, quantity, "repay" );
}

void minerSx::transfer( const name from, const name to, const name contract, const asset quantity, const string memo )
{
    token::transfer_action transfer( contract, { from, "active"_n });
    transfer.send( from, to, quantity, memo );
}
