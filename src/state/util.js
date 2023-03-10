import { ethers } from "ethers";
import PNFT from 'src/abis/PNFT.json';
import FungibleToken from 'src/abis/FungibleToken.json';
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

export const createFtContract = (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(address, FungibleToken.abi, provider);
}

export const createFtContractWithSigner = (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(address, FungibleToken.abi, signer);
}

export const shortenAddress = (address) => {
    if (address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return "";
}

function getRGB(c) {
    return parseInt(c, 16) || c
}

function getsRGB(c) {
    return getRGB(c) / 255 <= 0.03928
        ? getRGB(c) / 255 / 12.92
        : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4)
}

function getLuminance(hexColor) {
    return (
        0.2126 * getsRGB(hexColor.substr(1, 2)) +
        0.7152 * getsRGB(hexColor.substr(3, 2)) +
        0.0722 * getsRGB(hexColor.substr(-2))
    )
}

function getContrast(f, b) {
    const L1 = getLuminance(f)
    const L2 = getLuminance(b)
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
}

export function getTextColor(bgColor) {
    const whiteContrast = getContrast(bgColor, '#ffffff')
    const blackContrast = getContrast(bgColor, '#000000')

    return whiteContrast > blackContrast ? '#ffffff' : '#000000'
}

export function parseDuration(durationString) {
    const pattern = /(?:(\d+)d)?\s?(?:(\d+)h)?\s?(?:(\d+)m)?\s?(?:(\d+)s)?/;
    const matches = durationString.match(pattern);
    const days = matches[1] ? parseInt(matches[1]) : 0;
    const hours = matches[2] ? parseInt(matches[2]) : 0;
    const minutes = matches[3] ? parseInt(matches[3]) : 0;
    const seconds = matches[4] ? parseInt(matches[4]) : 0;
    if (typeof matches[1] === "undefined"
        && typeof matches[2] === "undefined"
        && typeof matches[3] === "undefined"
        && typeof matches[4] === "undefined") {
        return { error: true, result: 0 }
    } else {
        const durationInSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
        return { error: false, result: durationInSeconds }
    }
}

export function formatDuration(seconds) {
    const day = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hour = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    // using plural and singular form based on value
    const parts = [];
    if (day > 0) {
        parts.push(`${day}d`);
    }
    if (hour > 0) {
        parts.push(`${hour}h`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}m`);
    }
    if (seconds > 0) {
        parts.push(`${seconds}s`);
    }
    // joining parts with a comma and space
    let durationString = parts.join(' ');
    // remove parts with zero value
    durationString = durationString.replace(/0 [a-z]+(, )?/g, '');
    // handle case where duration is zero
    if (durationString === '') {
        durationString = '0s';
    }
    return durationString;
}

export function formatDurationLong(seconds) {
    const day = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hour = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    // using plural and singular form based on value
    const parts = [];
    if (day > 0) {
        parts.push(`${day} day${day === 1 ? '' : 's'}`);
    }
    if (hour > 0) {
        parts.push(`${hour} hour${hour === 1 ? '' : 's'}`);
    }
    if (minutes > 0) {
        parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
    }
    if (seconds > 0) {
        parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
    }
    // joining parts with a comma and space
    let durationString = parts.join(', ');
    // remove parts with zero value
    durationString = durationString.replace(/0 [a-z]+(, )?/g, '');
    // handle case where duration is zero
    if (durationString === '') {
        durationString = '0 seconds';
    }
    return durationString;
}