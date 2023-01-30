import { ethers } from "ethers";
import PNFT from 'src/abis/PNFT.json';
export const uploadBtfs = async (file) => {
    const formData = new FormData();
    formData.append('File', file);
    const options = {
        method: 'POST',
        body: formData
    };
    let result = await fetch("/api/btfs/upload", options);
    let data = await result.json();
    return data.Hash;
}
// export const uploadBtfs = async (file) => {
//     const ipfsForm = new FormData();
//     ipfsForm.append('media', file);
//     const options = {
//         method: 'POST',
//         body: ipfsForm
//     };
//     let result = await fetch("/api/btfs/upload", options);
//     let path = await result.text();
//     return path;
// }

export const uploadMetadata = async (values) => {
    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(values)
    };
    let result = await fetch("/api/btfs/metadata", options);
    let data = await result.json();
    return data.Hash;
}

// export const uploadMetadata = async (values) => {
//     const options = {
//         method: 'POST',
//         headers: {
//             "content-type": "application/json"
//         },
//         body: JSON.stringify(values)
//     };
//     let result = await fetch("/api/btfs/metadata", options);
//     let path = await result.text();
//     return path;
// }

export const createNftContract = (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(address, PNFT.abi, provider);
}

export const createNftContractWithSigner = (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(address, PNFT.abi, signer);
}
