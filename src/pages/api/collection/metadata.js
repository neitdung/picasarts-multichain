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

        const logo = files.logo;
        let newLogo = logo.newFilename + "." + mime.getExtension(logo.mimetype);
        const logoContent = await fs.readFile(logo.filepath);
        const logoFile = new File([logoContent], newLogo, { type: logo.mimetype });
        const banner = files.banner;
        let newBanner = banner.newFilename + "." + mime.getExtension(banner.mimetype);
        const bannerContent = await fs.readFile(banner.filepath);
        const bannerFile = new File([bannerContent], newBanner, { type: banner.mimetype });
        const metadata = await client.store({
            ...fields,
            logo: logoFile,
            banner: bannerFile
        });
        return res.status(200).send({...metadata});
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default handler;