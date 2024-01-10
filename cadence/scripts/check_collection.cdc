import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import Collectibles from "../contracts/Collectibles.cdc"

pub fun main(address: Address): Bool? {
    return Collectibles.checkCollection(_addr: address)  
}