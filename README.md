# picasarts-multichain

This is UI for Picasarts that can interact with [smart contracts](https://github.com/neitdung/picasarts-docs/blob/main/docs/contract.md) and [BTFS node](https://github.com/neitdung/picasarts-docs/blob/main/docs/btfs.md). NFT flow can be described as below:

![NFT flow](https://raw.githubusercontent.com/neitdung/picasarts-docs/main/imgs/nft-fl.png)

All functions of smart contracts have been implement on frontend. To access governance features, you must go to ```/admin``` (this url is hidden from frontend).

Multichain feature have been deploy but you need some configurations to use it:
- Rename file ```config.json``` to ```{chain-key}.json``` and move to folder ```src/state/config/```
- Config network and contract addresses at ```src/state/chain/config.js```

## Install
- Copy ```abis``` folder
- ```npm install```
- ```npm run build```
- ```npm run start```

## Design packages

![Pks design](https://raw.githubusercontent.com/neitdung/picasarts-docs/main/imgs/pkgs.png)

More documents: [picasarts-docs](https://github.com/neitdung/picasarts-docs)
