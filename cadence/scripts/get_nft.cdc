import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import Collectibles from "../contracts/Collectibles.cdc"

pub fun main(user: Address, id: UInt64): &NonFungibleToken.NFT? {
  let collectionCap= getAccount(user).capabilities
                      .get<&{Collectibles.CollectionPublic}>(/public/NFTCollection) 
                      ?? panic("This public capability does not exist.")

  let collectionRef = collectionCap.borrow()!

  return collectionRef.borrowNFT(id: id)
}