import { promises as fs } from 'fs';
import FormData from 'form-data';
import fetch from "node-fetch";
import { IncomingForm } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm()
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err)
                resolve({ fields, files })
            })
        })
        const contents = await fs.readFile(data?.files?.File.filepath)
        const formData = new FormData()
        formData.append('File', contents)
        const options = { method: 'POST', body: formData };
        let result = await fetch('http://localhost:5001/api/v1/add', options)
        let fileRes = await result.json();
        return res.status(200).send(fileRes);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default handler;