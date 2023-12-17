import * as fcl from "@onflow/fcl";

export async function getNFT(addr,id){
    return fcl.query({
        cadence: GET_NFT,
        args: (arg,t) => [arg(addr,t.Address), arg(id, t.UInt64)]
    });
}

const GET_NFT = `
import NonFungibleToken from 0xNonFungibleToken
import Collectibles from 0xCollectibles

pub fun main(user: Address, id: UInt64): &NonFungibleToken.NFT? {
  let collectionCap= getAccount(user).capabilities.get<&{Collectibles.CollectionPublic}>(/public/NFTCollection) ?? panic("This public capability does not exist.")

  let collectionRef = collectionCap.borrow()!

  return collectionRef.borrowNFT(id: id)
}
`;