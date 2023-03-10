import { ethers } from "ethers";
import PNFT from 'src/abis/PNFT.json';
import configFile from 'src/state/config.json';
import metadataHash from 'src/sample/metadatahash.json';
//"0x13B48cda3dFA356e2fF7C5d4096fC428B76d804d" 0xdae61584C8Ec30F623b4BF70B3553e5835265a2c
const handler = async (req, res) => {
    try {
        if (req.method === 'POST') {
            const provider = new ethers.providers.JsonRpcProvider();
            const signer1 = new ethers.Wallet(process.env.metaSK1, provider);
            const signer2 = new ethers.Wallet(process.env.metaSK2, provider);
            const signer3 = new ethers.Wallet(process.env.metaSK3, provider);
            const pnft1 = new ethers.Contract(configFile.pnft1, PNFT.abi, signer1);
            const pnft2 = new ethers.Contract(configFile.pnft2, PNFT.abi, signer2);
            const pnft3 = new ethers.Contract(configFile.pnft3, PNFT.abi, signer3);
            let nmsPromise = [];
            for (let i = 0; i < metadataHash.nms.length; i++) {
                nmsPromise.push(fetch(`http://127.0.0.1:8080/btfs/${metadataHash.nms[i]}`, { headers: { 'Content-Type': 'application/json' }}));
            }
            let nmsJson = await Promise.all(nmsPromise);
            let nmsJsonPromise = [];
            for (let i = 0; i < metadataHash.nms.length; i++) {
                nmsJsonPromise.push(nmsJson[i].json());
            }
            let nmsVal = await Promise.all(nmsJsonPromise);
            let csPromise = [];
            for (let i = 0; i < metadataHash.cs.length; i++) {
                csPromise.push(fetch(`http://127.0.0.1:8080/btfs/${metadataHash.cs[i]}`, { headers: { 'Content-Type': 'application/json' } }));
            }
            let csJson = await Promise.all(csPromise);
            let csJsonPromise = [];
            for (let i = 0; i < metadataHash.cs.length; i++) {
                csJsonPromise.push(csJson[i].json());
            }
            let csVal = await Promise.all(csJsonPromise);
            let cmPromise = [];
            for (let i = 0; i < metadataHash.cm.length; i++) {
                cmPromise.push(fetch(`http://127.0.0.1:8080/btfs/${metadataHash.cm[i]}`, { headers: { 'Content-Type': 'application/json' } }));
            }
            let cmJson = await Promise.all(cmPromise);
            let cmJsonPromise = [];
            for (let i = 0; i < metadataHash.cm.length; i++) {
                cmJsonPromise.push(cmJson[i].json());
            }
            let cmVal = await Promise.all(cmJsonPromise);
            for (let i = 0; i < metadataHash.nms.length; i++) {
                await pnft1.safeMint(process.env.metaPK1, metadataHash.nms[i], parseInt(nmsVal[i].royalty))
            }
            for (let i = 0; i < metadataHash.cs.length; i++) {
                await pnft2.safeMint(process.env.metaPK2, metadataHash.cs[i], parseInt(csVal[i].royalty))
            }
            for (let i = 0; i < metadataHash.cm.length; i++) {
                await pnft3.safeMint(process.env.metaPK3, metadataHash.cm[i], parseInt(cmVal[i].royalty))
            }
            return res.status(200).send({ error: false, nms: nmsVal });
                
        } else {
            return res.status(422).send({ error: true, message: "method_not_supported" });
        }
    } catch (e) {
        return res.status(422).send({ error: true, message: e.message });
    }

};

export default handler;