export const hubAddress = "0x128d9a6FE5b7105A633385dfc8E14F88481D5c7b"
export const marketAddress = "0x8aC74830691a89A6219D9E39D2969677D873be56"
export const loanAddress = "0x0f141EcD74b633c6159C1912f7391405227431a7"
export const rentalAddress = "0x479013Ec120B18D741604C210C387A18Fd351EAe"
export const daiAddress = "0xbFf9E179D2eC0760D00a49d209157Fa8bDBDe27b"
export const usdcAddress = "0x6E8cC6c439f1C2C7389291cE82A36C6bc84DC21d"
export const usdtAddress = "0xf118924Aac895fad8CF73f621b5ADA9aDb3644F5"
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
        wssAddress: "wss://goerli.infura.io/v3/",
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