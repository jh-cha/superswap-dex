# Superswap Dex

A multi-chain decentralised exchange(DEX) where users can authenticate themselves using Metamask, across web and mobile in order to swap tokens on the blockchain.

![image](https://github.com/jh-cha/superswap-dex-front/assets/140405044/71912807-29d3-4bc8-a81c-5d3cfd17502f)


## Stack

    Proivder - Infura, Metamask
    Blockchain Network - Ethereum
    Framework - React, Truffle
    Language - Typescript, Javscript, Solidity
    Stack etc. - Web3.js, Ehters.js, OpenZeppelin, UniswapSDK

## Running Locally

### Installation Steps

```
yarn install
```
then

```
yarn start
```

### Environment Variables

```
REACT_APP_INFURA_URL=
REACT_APP_WEB_API_KEY=
```

A .env file will need to be created at the highest level of the project folder, within this file 2 environment variables will need to be created. These will be for the Infura server URL and web API Key, which are used to initialize your dapp. 
