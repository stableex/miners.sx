#include <eosio.token/eosio.token.hpp>

#include "miner.sx.hpp"

[[eosio::action]]
void minerSx::mine( const name executor )
{
    require_auth( executor );

    check(false, "not ready yet");
}

// void minersSx::self_transfer( const name from, const name to, const extended_asset ext_quantity, const string memo )
// {
//     eosio::token::transfer_action transfer( ext_quantity.contract, { get_self(), "active"_n });
//     transfer.send( from, to, ext_quantity.quantity, memo );
// }

// // transfer & retire SX tokens
// void minersSx::burn( const asset quantity )
// {
//     eosio::token::transfer_action transfer( "token.sx"_n, { get_self(), "active"_n });
//     transfer.send( get_self(), "token.sx"_n, quantity, "nav" );

//     eosio::token::retire_action retire( "token.sx"_n, { "token.sx"_n, "active"_n });
//     retire.send( quantity, "nav" );
// }

// // issue & transfer SX tokens
// void minersSx::issue( const asset quantity )
// {
//     eosio::token::issue_action issue( "token.sx"_n, { "token.sx"_n, "active"_n });
//     issue.send( "token.sx"_n, quantity, "nav" );

//     eosio::token::transfer_action transfer( "token.sx"_n, { "token.sx"_n, "active"_n });
//     transfer.send( "token.sx"_n, get_self(), quantity, "nav" );
// }
