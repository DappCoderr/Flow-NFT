import * as fcl from "@onflow/fcl";

export async function mintNFT(name, image){
    return fcl.mutate({
        cadence: MINT_NFT,
        args: (arg, t) => [arg(name, t.String), arg(image, t.String)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit:999,
    });
}

const MINT_NFT = `
import NonFungibleToken from 0xNonFungibleToken
import Collectibles from 0xCollectibles

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
`