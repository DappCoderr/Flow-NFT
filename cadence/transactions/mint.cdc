import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import Collectibles from "../contracts/Collectibles.cdc"

transaction(name:String, image:String){
    let receiverCollectionRef: &{NonFungibleToken.CollectionPublic}
    prepare(signer:AuthAccount){
        // initialise account
        if signer.borrow<&Collectibles.Collection>(from: Collectibles.CollectionStoragePath) == nil {
            let collection <- Collectibles.createEmptyCollection()
            signer.save(<-collection, to: Collectibles.CollectionStoragePath)
            let cap = signer.capabilities.storage.issue<&{Collectibles.CollectionPublic}>(Collectibles.CollectionStoragePath)
            signer.capabilities.publish( cap, at: Collectibles.CollectionPublicPath)
        }
        //takes the receiver collection refrence
        self.receiverCollectionRef = signer.borrow<&Collectibles.Collection>(from: Collectibles.CollectionStoragePath)
      ?? panic("could not borrow Collection reference")
    }
    execute{
        let nft <- Collectibles.mintNFT(name:name, image:image)
        self.receiverCollectionRef.deposit(token: <-nft)
    }
}
