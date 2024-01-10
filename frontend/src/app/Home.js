import React from 'react'
import * as fcl from '@onflow/fcl'
import "./flow/config"

const Home = () => {
    const [currentUser, setCurrentUser] = useState({
        loggedIn: false, 
        addr: undefined,
    });

    useEffect(() => fcl.currentUser.subscribe(setCurrentUser), []);

  return (
    <div>
        <div className="navbar">
            <h1>Flow Collectibles Portal</h1>
            <span>Address: {currentUser?.addr ?? "NO Address"}</span>
            <button onClick={currentUser.addr ? fcl.unauthenticate : fcl.logIn}>
                {currentUser.addr ? "Log Out" : "Connect Wallet"}
            </button>
        </div>
        {currentUser.loggedIn ? (
            <div>Wallet is Connected!!</div>
        ) : (
            <div>Connect Wallet to Mint NFT</div>
        )}
    </div>
  )
}

export default Home