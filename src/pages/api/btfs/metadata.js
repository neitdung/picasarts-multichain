import FormData from 'form-data';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        var buf = Buffer.from(JSON.stringify(req.body));
        const formData = new FormData()
        formData.append('File', buf);
        const options = { method: 'POST', body: formData };
        let result = await fetch('http://localhost:5001/api/v1/add', options)
        let fileRes = await result.json();
        return res.status(200).send(fileRes);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default handler;
// import { create } from 'ipfs-http-client';

// const handler = async (req, res) => {
//     if (req.method === 'POST') {
//         const ipfs = create({
//             repo: Math.random() + Date.now()
//         });

//         const result = await ipfs.add(JSON.stringify(req.body))
//         return res.status(200).send(result.path);
//     } else {
//         return res.status(422).send('req_method_not_supported');
//     }
// };

// export default handler;