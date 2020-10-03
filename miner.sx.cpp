#include <eosio.token/eosio.token.hpp>
#include <sx.flash/flash.sx.hpp>
#include <sx.swap/swap.sx.hpp>
#include <sx.defibox/defibox.hpp>

#include "miner.sx.hpp"

[[eosio::action]]
void minerSx::mine( const name executor, const optional<symbol_code> symcode )
{
    require_auth( executor );

    // default
    asset quantity = asset{100'0000, symbol{"EOS", 4}};
    name contract = "eosio.token"_n;

    // USDT
    if ( *symcode == symbol_code{"USDT"} ) {
        quantity = asset{10'0000, symbol{"USDT", 4}};
        contract = "tethertether"_n;
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

    // check( defibox_to_dfs( contract, quantity ), "no Defibox<>DFS matches found");

    // repay flash loan
    repay.send( contract, quantity );

    // send profits to fee.sx
    profit.send( contract, quantity.symbol.code() );
}

[[eosio::action]]
void minerSx::test( const name contract, const asset quantity, const uint64_t pair_id )
{
    const auto [ reserveIn, reserveOut ] = defibox::getReserves( pair_id, quantity.symbol );
    const asset out = defibox::getAmountOut( quantity, reserveIn, reserveOut );
    // check( false, out.to_string() );

    minerSx::getamount_action getamount( get_self(), { get_self(), "active"_n });
    getamount.send( out );
    transfer( get_self(), "swap.defi"_n, contract, quantity, "swap,0," + to_string( pair_id ));
}

[[eosio::action]]
void minerSx::getamount( const asset out )
{
    require_auth( get_self() );
}

// EOS/USN = 9 (Defibox) - swap.defi
// EOS/USDT = 12 (Defibox) - swap.defi
// USN/USDT = 35 (Defibox) - swap.defi
// EOS/BOX = 194 (Defibox) - swap.defi
// EOS/USDT = 17 (DFS) - defisswapcnt
bool minerSx::defibox_to_dfs( const name contract, const asset quantity )
{
    // registrySx::defibox_table registry_defibox( "registry.sx"_n, "registry.sx"_n.value );
    // registrySx::dfs_table registry_dfs( "registry.sx"_n, "registry.sx"_n.value );
    // registrySx::tokens_table registry_tokens( "registry.sx"_n, "registry.sx"_n.value );

    // const symbol_code base = quantity.symbol.code();
    // const auto itr = registry_defibox.find( base.raw() );

    // // stats
    // int64_t highest_delta = -9999;
    // symbol_code highest_quote;

    // for ( const auto row : itr->quotes ) {
    //     const symbol_code quote = row.first;
    //     const uint64_t pair_id = row.second;

    //     // does exist in token table
    //     const auto tokens_itr = registry_tokens.find( quote.raw() );
    //     if ( tokens_itr == registry_tokens.end() ) continue;

    //     // skip if not in dfs
    //     const auto dfs_itr = registry_dfs.find( base.raw() );
    //     if ( dfs_itr == registry_dfs.end() ) continue;
    //     if ( !dfs_itr->quotes.at( quote ) ) continue;

    //     // skip if DFS pair does not exist
    //     const uint64_t mid = get_pair_id( registry_dfs, base, quote );

    //     const asset defibox_quantity = defibox::getAmountOut( quantity, pair_id );
    //     const asset dfs_quantity = dfs::getAmountOut( defibox_quantity, mid, quote );
    //     const asset delta = dfs_quantity - quantity;

    //     // update stats in case fail
    //     if ( delta.amount > highest_delta ) {
    //         highest_delta = delta.amount;
    //         highest_quote = quote;
    //     }

    //     // // success
    //     // if ( delta.amount > 0 ) {
    //     //     transfer( get_self(), "swap.defi"_n, contract, quantity, "swap,0," + to_string(pair_id) );
    //     //     transfer( get_self(), "defisswapcnt"_n, tokens_itr->contract, defibox_quantity, "swap:" + to_string(mid) );
    //     //     return true;
    //     // }
    // }
    // check( false, base.to_string() + " => " + highest_quote.to_string() + " by " + to_string( highest_delta ));
    return false;
}

template <typename T>
uint64_t minerSx::get_pair_id( T& table, const symbol_code base, const symbol_code quote )
{
    const auto itr = table.find( base.raw() );
    if ( itr != table.end() ) {
        return itr->quotes.at( quote );
    }
    return 0;
}

// EOS/USN = 9 (Defibox) - swap.defi
// EOS/USDT = 12 (Defibox) - swap.defi
// USN/USDT = 35 (Defibox) - swap.defi
bool minerSx::sx_to_defibox( const name contract, const asset quantity )
{
    // const uint8_t pair_id = 35;

    // // SX => Defibox
    // const asset sx_quantity_1 = swapSx::get_rate("stable.sx"_n, quantity, symbol_code{"USN"} );
    // const asset defibox_quantity_1 = defibox::getAmountOut( sx_quantity_1, pair_id );
    // const asset delta_1 = defibox_quantity_1 - quantity;

    // // Defibox => SX
    // const asset defibox_quantity_2 = defibox::getAmountOut( quantity, pair_id );
    // const asset sx_quantity_2 = swapSx::get_rate("stable.sx"_n, defibox_quantity_2, symbol_code{"USDT"} );
    // const asset delta_2 = sx_quantity_2 - quantity;

    // if ( delta_1 > delta_2 ) {
    //     transfer( get_self(), "stable.sx"_n, "tethertether"_n, quantity, "USN" );
    //     transfer( get_self(), "swap.defi"_n, "danchortoken"_n, sx_quantity_1, "swap,0," + to_string(pair_id) );
    // } else {
    //     transfer( get_self(), "swap.defi"_n, "tethertether"_n, quantity, "swap,0," + to_string(pair_id) );
    //     transfer( get_self(), "stable.sx"_n, "danchortoken"_n, defibox_quantity_2, "USDT" );
    // }
    // // check( delta.amount > 0, delta.to_string() + " delta | " + sx_quantity.to_string() + " sx | " + defibox_quantity.to_string() + " defibox");
    return true;
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

    const asset balance = token::get_balance( contract, get_self(), quantity.symbol.code() );
    const asset remaining = balance - quantity;
    check( remaining.amount >= 0, "cannot pay flashloan by " + remaining.to_string() );
    transfer( get_self(), "flash.sx"_n, contract, quantity, "repay" );
}

void minerSx::transfer( const name from, const name to, const name contract, const asset quantity, const string memo )
{
    token::transfer_action transfer( contract, { from, "active"_n });
    transfer.send( from, to, quantity, memo );
}
