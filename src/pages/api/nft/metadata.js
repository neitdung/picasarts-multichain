import { promises as fs } from 'fs';
import { IncomingForm } from 'formidable';
import { NFTStorage, File } from 'nft.storage';
import mime from "mime/lite";

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN })

        const { fields, files } = await new Promise((resolve, reject) => {
            const form = new IncomingForm()
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err)
                resolve({ fields, files })
            })
        });

        const media = files.media;
        let newFileName = media.newFilename + "." + mime.getExtension(media.mimetype);
        const content = await fs.readFile(media.filepath);
        const mediaFile = new File([content], newFileName, { type: media.mimetype });
        const metadata = await client.store({
            ...fields,
            attributes: JSON.parse(fields.attributes),
            image: mediaFile
        });

        return res.status(200).send(metadata);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default handler;