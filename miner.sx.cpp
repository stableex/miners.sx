#include <eosio.token/eosio.token.hpp>
#include <sx.flash/flash.sx.hpp>

#include "miner.sx.hpp"

[[eosio::action]]
void minerSx::mine( const name executor )
{
    require_auth( executor );

    const asset quantity = asset{500000, symbol{"EOS", 4}};
    const name contract = "eosio.token"_n;

    borrow( contract, quantity );
}

[[eosio::on_notify("flash.sx::callback")]]
void minerSx::on_callback( const name to, const name contract, asset quantity, const string memo, const name recipient )
{
    repay( contract, quantity );
}
