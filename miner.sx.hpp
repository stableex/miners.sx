#pragma once

#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/singleton.hpp>
#include <eosio/asset.hpp>

#include <string>

using namespace eosio;
using namespace std;

class [[eosio::contract("miner.sx")]] minerSx : public contract {
public:
    using contract::contract;

    /**
     * ## TABLE `docs`
     *
     * - `{string} url` - Documentation url
     *
     * ### example
     *
     * ```json
     * {
     *   "url": "https://github.com/stableex/sx.miner"
     * }
     * ```
     */
    struct [[eosio::table("docs")]] docs_row {
        string      url = "https://github.com/stableex/sx.miner";
    };
    typedef eosio::singleton< "docs"_n, docs_row > docs;

    [[eosio::action]]
    void mine( const name executer );

private:
};
