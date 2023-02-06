import configFile from "src/state/config.json";

export const hubAddress = configFile.hub
export const marketAddress = configFile.market
export const loanAddress = configFile.loan
export const rentalAddress = configFile.rental
export const daiAddress = configFile.dai
export const usdcAddress = configFile.usdc
export const usdtAddress = configFile.usdt
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
        hubAddress: hubAddress,
        loanAddress: loanAddress,
        rentalAddress: rentalAddress,
        marketAddress: marketAddress,
    },
    "picasarts": {
        rpcAddress: "https://goerli.infura.io/v3/",
        logoURL: "",
        wssAddress: "wss://goerli.infura.io/v3/",
        chainId: 5,
        blockchainExplorer: "https://goerli.etherscan.io",
        name: "Goerli chain",
        nativeToken: {
            name: "ETH",
            symbol: "ETH",
            logo: "/eth.png",
            address: noneAddress,
            decimals: 18
        },
        hubAddress: hubAddress,
        loanAddress: loanAddress,
        rentalAddress: rentalAddress,
        marketAddress: marketAddress,
    },
}

export const chainInfos = {
    "calamus": { label: "Calamus Chain", logo: "/calamus.png", disabled: false },
    "picasarts": { label: "Picasarts Chain", logo: "/picsarts.webp", disabled: false },
}
export const tokenArray = [
    {
        tokenId: noneAddress,
        tokenAbbr: "CLT",
        tokenDecimal: 18,
        name: "Calamus token",
        tokenLogo: "/calamus.png"
    },
    {
        tokenId: daiAddress,
        tokenAbbr: "DAI",
        tokenDecimal: 18,
        name: "Maker DAI",
        tokenLogo: "/dai.png"
    },
    {
        tokenId: usdcAddress,
        tokenAbbr: "USDC",
        tokenDecimal: 18,
        name: "Coinbase USD",
        tokenLogo: "/usdc.png"
    },
    {
        tokenId: usdtAddress,
        tokenAbbr: "USDT",
        tokenDecimal: 18,
        name: "Tether USD",
        tokenLogo: "/usdt.png"
    },
];