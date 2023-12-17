import * as fcl from "@onflow/fcl";

export async function checkCollection(addr){
    return fcl.query({
        cadence: CHECK_COLLECTION,
        args: (arg,t) => [arg(addr, t.Address)],
    });
}

const CHECK_COLLECTION = `
import NonFungibleToken from 0xNonFungibleToken
import Collectibles from 0xCollectibles

pub fun main(address: Address): Bool? {
    return Collectibles.checkCollection(_addr: address)
}
`;