#pragma once

#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/asset.hpp>

#include <sx.uniswap/uniswap.hpp>

using namespace eosio;

class [[eosio::contract("swap.defi")]] defibox : public contract {
public:
    using contract::contract;

    struct [[eosio::table]] pairs_row {
        uint64_t            id;
        extended_symbol     token0;
        extended_symbol     token1;
        asset               reserve0;
        asset               reserve1;
        uint64_t            liquidity_token;

        uint64_t primary_key() const { return id; }
    };
    typedef eosio::multi_index< "pairs"_n, pairs_row > pairs;

    static asset getAmountOut( const asset quantity, const uint8_t pair_id )
    {
        defibox::pairs _pairs( "swap.defi"_n, "swap.defi"_n.value );
        auto pair = _pairs.get( pair_id );

        // checks
        check( pair.reserve0.symbol.precision() == pair.reserve0.symbol.precision(), "reserve precisions must be equal");
        check( quantity.symbol.precision() == pair.reserve0.symbol.precision(), "quantity does not match precision of reserve0");
        check( quantity.symbol.precision() == pair.reserve1.symbol.precision(), "quantity does not match precision of reserve1");

        // get inverse reserve
        const bool reverse = quantity.symbol == pair.reserve0.symbol;
        const asset reserveIn = reverse ? pair.reserve0 : pair.reserve1;
        const asset reserveOut = reverse ? pair.reserve1 : pair.reserve0;
        const int64_t amount = uniswap::getAmountOut( quantity.amount, reserveIn.amount, reserveOut.amount );

        return asset{ amount, reserveOut.symbol };
    }
};