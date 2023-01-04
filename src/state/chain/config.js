export const hubAddress = "0xB5eA70dd6dd06f335B5196F5A64FafC88C9c0De3"
export const marketAddress = "0x8082115700Be050A1c4f42Ad43e3fed67D8b6805"
export const loanAddress = "0x0FCC13A4B25Eb4B08BddEF10F381ABd67A0D7f6a"
export const rentalAddress = "0x150FE7F81A899480581ACF32edA921F4be1b6DDc"
export const daiAddress = ""
export const usdcAddress = ""
export const usdtAddress = ""
export const noneAddress = "0x0000000000000000000000000000000000000000"

export const config = {
    "calamus": {
        rpcAddress: "http://localhost:8545",
        logoURL: "",
        wssAddress: "wss://localhost:8545",
        chainId: 1337,
        blockchainExplorer: "http://localhost:8545",
        name: "Calamus chain",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18
        },
        hubAddress: hubAddress,
        loanAddress: loanAddress,
        rentalAddress: rentalAddress,
        marketAddress: marketAddress,
    },
    "picasarts": {
        rpcAddress: "https://goerli.infura.io/v3/",
        logoURL: "",
        wssAddress: "https://goerli.infura.io/v3/",
        chainId: 5,
        blockchainExplorer: "https://goerli.etherscan.io",
        name: "Goerli chain",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
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