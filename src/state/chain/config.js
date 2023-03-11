import calamusConfig from "src/state/config/calamus.json";
import ftmConfig from "src/state/config/bttc.json";
import bttcConfig from "src/state/config/bttc.json";
import avaxConfig from "src/state/config/bttc.json";

export const noneAddress = "0x0000000000000000000000000000000000000000"

export const config = {
    "calamus": {
        rpcAddress: "http://localhost:8545",
        logoURL: "",
        wssAddress: "wss://localhost:8545",
        chainId: 1337,
        blockchainExplorer: "http://localhost:8545",
        name: "Calamus chain",
        nativeToken: {
            name: "ETH",
            symbol: "ETH",
            logo: "/eth.png",
            decimals: 18,
            address: noneAddress
        },
        hubAddress: calamusConfig.hub,
        loanAddress: calamusConfig.loan,
        rentalAddress: calamusConfig.rental,
        marketAddress: calamusConfig.market,
    },
    "bttc": {
        rpcAddress: "https://pre-rpc.bt.io/",
        logoURL: "",
        wssAddress: "wss://pre-rpc.bt.io:8546",
        chainId: 1029,
        blockchainExplorer: "https://testscan.bt.io/",
        name: "BitTorrent Chain",
        nativeToken: {
            name: "BTT",
            symbol: "BTT",
            logo: "/bttc.png",
            address: noneAddress,
            decimals: 18
        },
        hubAddress: bttcConfig.hub,
        loanAddress: bttcConfig.loan,
        rentalAddress: bttcConfig.rental,
        marketAddress: bttcConfig.market,
    },
    "avax": {
        rpcAddress: "https://api.avax-test.network/ext/bc/C/rpc",
        logoURL: "",
        wssAddress: "https://api.avax-test.network/ext/bc/C/rpc",
        chainId: 43113,
        blockchainExplorer: "https://testnet.snowtrace.io/",
        name: "Avalanche Fuji C-Chain",
        nativeToken: {
            name: "AVAX",
            symbol: "AVAX",
            logo: "/avax.png",
            address: noneAddress,
            decimals: 18
        },
        hubAddress: avaxConfig.hub,
        loanAddress: avaxConfig.loan,
        rentalAddress: avaxConfig.rental,
        marketAddress: avaxConfig.market,
    },
    "ftm": {
        rpcAddress: "https://rpc.testnet.fantom.network/",
        logoURL: "",
        wssAddress: "https://rpc.testnet.fantom.network/",
        chainId: 4002,
        blockchainExplorer: "https://testnet.ftmscan.com/",
        name: "Fantom testnet",
        nativeToken: {
            name: "FTM",
            symbol: "FTM",
            logo: "/ftm.png",
            address: noneAddress,
            decimals: 18
        },
        hubAddress: ftmConfig.hub,
        loanAddress: ftmConfig.loan,
        rentalAddress: ftmConfig.rental,
        marketAddress: ftmConfig.market,
    },
}

export const chainInfos = {
    "ftm": { label: "Fantom", logo: "/ftm.png", disabled: false },
    "avax": { label: "Avalanche C Chain", logo: "/avax.png", disabled: false },
    "bttc": { label: "BitTorrent Chain", logo: "/bttc.png", disabled: false },
}