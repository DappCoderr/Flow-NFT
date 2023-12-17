"use client"
import React, { useState, useEffect, useRef } from 'react';
import * as fcl from "@onflow/fcl";
import "./page.css";
import "./flow/config";
import { mintNFT } from "./transaction/mint.txn";
import { checkCollection } from "./script/checkCollection.script";
import { getNFTId } from "./script/getID.script";
import { getNFT } from "./script/getNFT.script";

export default function Home() {
  const urlInputRef = useRef();
  const nameInputRef = useRef();
  const idInputRef = useRef();

  const [currentUser, setUser] = useState({
    loggedIn: false,
    addr: undefined,
  });

  const [isInitialized, setIsInitialized] = useState();
  const [collectiblesList, setCollectiblesList] = useState([]);
  const [ids, setIds] = useState([]);
  const [nft, setNFT] = useState({});

  useEffect(() => {
      checkCollectionInit();
      viewNFT()
  }, [currentUser]);

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  useEffect(() => {
    if (currentUser.loggedIn) {
      setCollectiblesList(TEST_COLLECTIBLES);
      console.log('Setting collectibles...');
    }
  }, [currentUser]);

  const saveCollectible = async () => {
    if (urlInputRef.current.value.length > 0 && nameInputRef.current.value.length > 0) {
      console.log('Collectibles name:', nameInputRef.current.value);
      console.log('Collectibles url:', urlInputRef.current.value);
      const transaction = mintNFT(nameInputRef.current.value, urlInputRef.current.value);
      console.log('transactionID:', transaction);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const TEST_COLLECTIBLES = [
    // 'https://apod.nasa.gov/apod/image/2305/M27_Cosgrove_2717.jpg',
    // 'https://apod.nasa.gov/apod/image/2305/SeaBlueSky_Horalek_960.jpg',
    // 'https://apod.nasa.gov/apod/image/2305/virgoCL2048.jpg',
    // 'https://apod.nasa.gov/apod/image/1601/2013US10_151221_1200Chambo.jpg'
  ];

  async function checkCollectionInit() {
    const isInit = await checkCollection(currentUser?.addr);
    console.log(isInit);
    setIsInitialized(isInit);
  }

  async function viewNFT() {
    console.log(idInputRef.current);
    const nfts = await getNFT(currentUser?.addr, idInputRef.current);
    console.log(nfts);
    setNFT(nfts);
  }

  async function viewIds() {
    const ids = await getNFTId(currentUser?.addr);
    console.log(ids);
    setIds(ids);
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;

    if (/^\d+$/.test(inputValue)) {
      idInputRef.current = +inputValue;
    } else {
      console.error('Invalid input. Please enter a valid integer.');
    }
  }

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
        <div className='main'>
          <div className='mutate'>
            <h1>Mutate Flow Blockchain</h1>
            <form onSubmit={(event) => {
              event.preventDefault();
              saveCollectible();
            }}>
              <input type="text" placeholder='enter name of the NFT' ref={nameInputRef}/>
              <input type="text" placeholder='enter a url' ref={urlInputRef}/>
              <button type='submit'>Mint</button>
            </form>
            <mark>Your Collection will be initialized while minting NFT.</mark>
          </div>
          <div className='query'>
            <h1>Query Flow Blockchain</h1>
            <mark>Click below button to check 👇</mark>
            <button onClick={checkCollectionInit}>Check Collection</button>
            <p>Is your collection initialized: {isInitialized?"Yes":"No"}</p>
            <button onClick={viewIds}>View NFT IDs you hold in your collection</button>
            <p>NFT Id: </p>
            {ids.map((id)=>(
              <p key={id}>{id}</p>
            ))}
          </div>
          <div className='view'>
            <h1>View Your NFT</h1>
            <input type="text" placeholder='enter your NFT ID' onChange={handleInputChange}/>
            <button onClick={viewNFT}>View NFT</button>
            <div className='nft-card'>
              <p>NFT id: {nft.id}</p>
              <p>NFT name: {nft.name}</p>
              <img src={nft.image} alt={nft.name}/>
            </div>
          </div>
        </div>
      ) : (
        <div className='main-2'>
          <h1>Connect Wallet to mint NFT!!</h1>
          <div className='main-image'>
            {TEST_COLLECTIBLES.map((url)=>(
              <img src={url} alt={url} key={url}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
