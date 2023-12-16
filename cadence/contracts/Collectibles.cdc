import NonFungibleToken from "./NonFungibleToken.cdc"

pub contract Collectibles: NonFungibleToken{

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    pub var totalSupply: UInt64

    pub resource NFT: NonFungibleToken.INFT{
        pub let id: UInt64
        pub var name: String
        pub var image: String

        init(_id:UInt64, _name:String, _image:String){
            self.id = _id
            self.name = _name
            self.image = _image
        }
    }

    pub resource interface CollectionPublic{
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
    }

    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic{
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init(){
            self.ownedNFTs <- {}
        }

        destroy (){
            destroy self.ownedNFTs
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <-token
            destroy oldToken
            emit Deposit(id: id, to: self.owner?.address)
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            if self.ownedNFTs[id] != nil {
                return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
            }
            panic("NFT not found in collection.")
        }

        pub fun getIDs(): [UInt64]{
            return self.ownedNFTs.keys
        }
    }

    pub fun createEmptyCollection(): @Collection{
        return <- create Collection()
    }

    pub fun checkCollection(_addr: Address): Bool{
        return getAccount(_addr)
        .capabilities.get<&{Collectibles.CollectionPublic}>(Collectibles.CollectionPublicPath)!
        .check()
    }

    pub fun mintNFT(name:String, image:String): @NFT{
        Collectibles.totalSupply = Collectibles.totalSupply + 1 
        let nftId = Collectibles.totalSupply
        var newNFT <- create NFT(_id:nftId, _name:name, _image:image)
        return <- newNFT
    }

    init(){
        self.CollectionPublicPath = /public/NFTCollection
        self.CollectionStoragePath = /storage/NFTCollection

        self.totalSupply = 0
        emit ContractInitialized()
    }
}








