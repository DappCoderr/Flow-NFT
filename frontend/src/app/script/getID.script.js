import * as fcl from "@onflow/fcl";

export async function getNFTId(addr){
    return fcl.query({
        cadence: GET_NFT_ID,
        args: (arg,t) => [arg(addr,t.Address)]
    });
}

const GET_NFT_ID = `
import NonFungibleToken from 0xNonFungibleToken
import Collectibles from 0xCollectibles

pub fun main(user: Address): [UInt64] {
    let collectionCap= getAccount(user).capabilities.get<&{Collectibles.CollectionPublic}>(/public/NFTCollection) ?? panic("This public capability does not exist.")
    let collectionRef = collectionCap.borrow()!
    return collectionRef.getIDs()
}
`;