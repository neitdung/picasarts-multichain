import { ethers } from "ethers";
import FungibleToken from 'src/abis/FungibleToken.json';
export const createFtContract = (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(address, FungibleToken.abi, provider);
}