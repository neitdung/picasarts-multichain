import attributes from 'src/sample/attributes.json';
import configFile from 'src/sample/config.json';
import FormData from 'form-data';

const nomanskyhash = [
    "Qmejo1PSBo6TR2DPUmsEGkKHMBmn1BQpNWPv2hsRCwYL8X",
    "QmWYhMYepoVToJW2w91zacHFzg7GB4xGS9BP5W32F74CdK",
    "QmcJZTxKs9LTnTC4jvoSzkaLx143FvPibmKGck93swfFh4",
    "QmRQ8e8aMaZENyiXQTeho2aNzSHDHn1uSC8zHrJ5CePDMG",
    "QmZEfHSooj8hJppGvMbh65GmPDCTzdxbg1xGsAumJ3acqG",
    "QmYHXL5PLKZ9BgVvUzRMERHvMXyLEAMWBSMuLvfHrTPkWc",
    "QmerTuftM1siP2SawyngjeYbEfr8a4ezZa8ZZJ6aaNKRnJ",
    "QmehV1GDxxNdVv4hVCW93sRjtsPxcbU1rGVh2SmnkThVJN",
    "QmWWbAQA8Zf3ZeaNjrA6ECwfQR7MXEsQszNWPzvpb11Bnb",
    "QmSE4z4qdwj6JyuK5mA3HR55HhJLJvSRquS2PkeJbmLaqk",
    "QmQtEWd7bEFR7vAWUB9RzAnBCxahgGAgX6hkeDC9QjxwRn",
    "QmbYLfXNFwV7rJ4xowfRpA5vMovUuwGa61F2VXjo4ZL4Mo",
    "QmVTaQcrYTvqbEYD84E3uocd8gtNVEHUrvQmmpen7Q7DKp",
    "QmPdQu6NgcRhAJj6cSSWZdqauHNhTcsoAwiu7NE9VQ5nYF",
    "Qmab2z627CU6FowediAamyS7tcqyrMHEbSW2FBqUS2NmMg",
    "QmcCsDpDYJp6pNTi4Y8UjxromzxqCvNjKmyugT3YyZ25gk",
    "QmZtFtJFFC6b8U2AVk8EdY6NXT1zk6uGAqAcT23xmFjfwD",
    "QmcU1CfCdBwNeWW8kGHVMZTCbMrZhJDfh74d1HYh5xNZPa",
    "QmcV5ePWjeTLwbMshkSCuhusyRFVsCpQbC6wpkreZ6geXN",
    "QmXWmGWLXFNNEL4nQW7Yb1UA7D48NLDhpK4BmW7a9yYzmu",
    "QmZgTUs5Wpj7MNUdAiPDsSvqCSGazekBzGYMF2ThFox8Nk",
    "Qmb5dqft67yabgrnZhkDepUCicuLNjBPaS8GyRqrpuSdAn",
    "QmRQj5J3oHAu1F14N72uYHPSLnH9DSMgPwqawq2Efn1uNT",
    "QmPBDbL9MR2gQBZ2dEuUcuRzccPLJPEwkLNpnfpJaSSXY8",
    "QmW1x5dPksCbGA5LD2RMKp2kuCk8axngxh7JWt1FkD9oe8",
    "QmZQyGxAX4WvCHnXvnURXDwVS6NoquZHZDK7QzE24S2uSR",
    "QmU7nZumCEqSPfXVfz7Wv12LRVdxsnMfy9qzp4A1VVsRBv",
    "QmTPqwq8RVBhuuxrZcJqULq1TQ3pFZcxE5YQF5iZRNwZNq",
    "QmeWwmBSDu9T6WiaNrsgAQVRHR8RjE5yz7aNaQ5Evu7wAF",
    "QmU9QbGUAraSx1xzhYLtEa1k5wNANUaW7Dm6H5bV8KipiZ",
    "QmeCy4kMJZ8oG5yGmPQiczLSVgc1kbKoJLNZXXVBNhfVbc",
    "QmVSxP8FTobesBkETTyRv6bBDnDm6B4X6zLKYjsGcKCfLw",
    "QmWu9LVT7LxHhvYUWD8TBnSji87ghUL5ZrxsBNKUghoMCd",
    "QmVBNcu4YN2Pd659wukraHEqYvBJ9Rn5eNWW5R2ADLFKSx",
    "QmZJLj443GhphB8bqutYGi9EQ9h1Zy5Zf42pwK1Xowk5pR"
];
const colorsinglehash = [
    "QmS5gBFxSNGCKKgpjUfuLiuXGxm1D6sW8x5z6hziqfyZvD",
    "QmYJynC1uGDouSv3vqrAT6JHTfioJAbZdY2yioDtdJjh9Y",
    "QmReccrQhtKSffNmD5VmkaUCpSV6nc5Pme1kfFWiKiX6sX",
    "QmQ1o2Dxhqx858CZoy53PvSRCthpUoyNPGvYKSFkvmthoz",
    "QmWxbdNpppJaLynd3dQVZd7RRbPncW4q8k4vEmQe65qhXp",
    "QmbVAUApTe7mhvZPGd3FVVadDuaNs3iCUN4hfnnxCt4moD",
    "QmaSbHijm4NTKH5rvDux87NzYXmaodiJqSczZhcJq3vuW5",
    "QmeN23JxFtVaskx7KFQfbJfamvLvzeswTbVNmBT1WtnQE7",
    "QmNTXJ9aq998UetDtMf96mAgxx8u5N8JqStSKBPS6KDZ1d",
    "QmVn3qvEy1csmUkeZSqYmtXQuqbP7zbxqKfA57YT3KLZnh",
    "QmPRLbEkMco6DvdG4inANVQQRuac9iRHm7TcaQhA48DdEv",
    "QmV4nzsF23yqEn73zvkf2fCxK618Duaa27CmwjfMSPQNhF",
    "QmRcZDa41PD6wyr57H1S5xayoHC9pXy827Y4yVaojDbbnm",
    "QmR25aYBSm7eC1Na4V1Nwnd2s2Qw2tQRoQ9QmBii3eDT8P",
    "QmUhKAPQ28b77QJ6eHLHdzpZoWjL4ehcvmbfPE83dfRnkL",
    "QmXGhqCvSf5tv4s9zsZNxrBvBVEHVENxFJ5m73v8TBAYop",
    "QmfU8brArbiTf76VBNcgdd7hGZeXikBFMMC23L4n76s3vK",
];
const colormultihash = [
    "QmTe4UxPQEjHHz7q6GTvyTTJuJTQcymDJterwqR3eBwLQE",
    "QmUvNfXBgATCidHvAti4Vzw38yy1ycVT7GRU5WmnVPNqHY",
    "QmYVTjVneS6Px9NSSk6dbbUktmXvBEQ47K5By4mWJZxYoE",
    "QmZovTzmh4qg1th2KPybVR8ZuK3YwzLavNbipH1WByNvJH",
    "QmdrcXkH4JD5hBFmgF28GRtniDm2JxK7cjwZJhm4ZaVf1Q",
    "QmVAsXYVMfMcaVbUpatNFKNMwNCjeVPf2tmUrZpo4LvKap",
    "QmSuGReLqzr32koDsGry48EghJ1qR8giFDRj6L9AcHj9zx",
    "QmYtzXYHR8zbpgh7zjZNTLBsPtsHK178JMH3zCYQqmAQaP",
    "QmYtzXYHR8zbpgh7zjZNTLBsPtsHK178JMH3zCYQqmAQaP",
    "QmUE1X1gyY4WoKiCas5zR4zRFSXJdqdavkQ8yhY9QGP5Ff",
    "QmUMGapuY3qoijUrQeWxTNJN6ndU76QBsMcgd7zDjjquL2",
    "QmaguXEPjAYWdLG8fXKoqZiaR1Dpxi5tKGJdycAQh2SBSJ",
    "QmdP1Xaz9svuL7u7vYcbDsozan9v3cPpUiU7PWSkThayQh",
    "QmdRuUTBV4Hbw1mvne4VyXR5jkG3Y7tXQeAarpZ65YgDNx",
    "QmdRuUTBV4Hbw1mvne4VyXR5jkG3Y7tXQeAarpZ65YgDNx",
    "QmaFffU57h5M3WZJ7GgiT3UQuh8peUuJT4MmkiyUocgX2Q"
];
// luck: [0-100]
// hard: [0-100]
// buff: [0-100]*i
// volumn: [0-100]*i/2
const handler = async (req, res) => {
    try {
        if (req.method === 'POST') {
            let nmspromise = [];
            for (let i = 0; i < nomanskyhash.length; i++) {
                let rand = Math.floor(Math.random() * 100);
                let metadata = {
                    contract_address: configFile.pnft1,
                    name: attributes.name[i],
                    description: attributes.description[i],
                    external_url: "",
                    royalty: rand.toString(),
                    background_color: "#FFFFFF",
                    creator_address: configFile.addr1,
                    image: nomanskyhash[i], 
                    attributes: [
                        {
                            display_type: "boost_percentage",
                            trait_type: "Luck",
                            value: rand
                        },
                        {
                            display_type: "boost_percentage",
                            trait_type: "Hard Level",
                            value: rand
                        }, 
                        {
                            display_type: "boost_number",
                            trait_type: "Buff",
                            value: rand * i
                        }, 
                        {
                            display_type: "boost_number",
                            trait_type: "Volumn",
                            value: rand * i *(i % 8)
                        }, 
                        {
                            display_type: "string",
                            trait_type: "Main",
                            value: attributes.main[i+2]
                        }, 
                        {
                            display_type: "string",
                            trait_type: "Bug",
                            value: attributes.bug[i+3]
                        },
                        {
                            display_type: "string",
                            trait_type: "Passive",
                            value: attributes.passive[i + 4]
                        },
                    ]
                }
                var buf = Buffer.from(JSON.stringify(metadata));
                const formData = new FormData()
                formData.append('File', buf);
                const options = { method: 'POST', body: formData };
                nmspromise.push(fetch('http://127.0.0.1:5001/api/v1/add', options))
            }
            let nmsFetch = await Promise.all(nmspromise);
            let nmsJson = [];
            for (let i = 0; i < nmsFetch.length; i++) {
                nmsJson.push(nmsFetch[i].json());
            }
            let nmsVal = await Promise.all(nmsJson);

            let cspromise = [];
            for (let i = 0; i < colorsinglehash.length; i++) {
                let rand = Math.floor(Math.random() * 100);
                let metadata = {
                    contract_address: configFile.pnft2,
                    name: attributes.name[i],
                    description: attributes.description[i],
                    external_url: "",
                    royalty: rand.toString(),
                    background_color: "#000000",
                    creator_address: configFile.addr2,
                    image: colorsinglehash[i],
                    attributes: [
                        {
                            display_type: "boost_percentage",
                            trait_type: "Luck",
                            value: rand
                        },
                        {
                            display_type: "boost_percentage",
                            trait_type: "Hard Level",
                            value: rand +2
                        },
                        {
                            display_type: "boost_number",
                            trait_type: "Buff",
                            value: rand * i
                        },
                        {
                            display_type: "boost_number",
                            trait_type: "Volumn",
                            value: rand * i * (i % 8)
                        },
                        {
                            display_type: "string",
                            trait_type: "Main",
                            value: attributes.main[i + 2]
                        },
                        {
                            display_type: "string",
                            trait_type: "Bug",
                            value: attributes.bug[i + 3]
                        },
                        {
                            display_type: "string",
                            trait_type: "Passive",
                            value: attributes.passive[i + 4]
                        },
                    ]
                }
                var buf = Buffer.from(JSON.stringify(metadata));
                const formData = new FormData()
                formData.append('File', buf);
                const options = { method: 'POST', body: formData };
                cspromise.push(fetch('http://127.0.0.1:5001/api/v1/add', options))
            }
            let csFetch = await Promise.all(cspromise);
            let csJson = [];
            for (let i = 0; i < csFetch.length; i++) {
                csJson.push(csFetch[i].json());
            }
            let csVal = await Promise.all(csJson);

            let cmpromise = [];
            for (let i = 0; i < colormultihash.length; i++) {
                let rand = Math.floor(Math.random() * 100);
                let metadata = {
                    contract_address: configFile.pnft3,
                    name: attributes.name[i],
                    description: attributes.description[i],
                    external_url: "",
                    royalty: rand.toString(),
                    background_color: "#666666",
                    creator_address: configFile.addr3,
                    image: colormultihash[i],
                    attributes: [
                        {
                            display_type: "boost_percentage",
                            trait_type: "Luck",
                            value: rand /2 +24
                        },
                        {
                            display_type: "boost_percentage",
                            trait_type: "Hard Level",
                            value: rand +3
                        },
                        {
                            display_type: "boost_number",
                            trait_type: "Buff",
                            value: rand * i
                        },
                        {
                            display_type: "boost_number",
                            trait_type: "Volumn",
                            value: rand * i * (i % 8)
                        },
                        {
                            display_type: "string",
                            trait_type: "Main",
                            value: attributes.main[i + 2]
                        },
                        {
                            display_type: "string",
                            trait_type: "Bug",
                            value: attributes.bug[i + 3]
                        },
                        {
                            display_type: "string",
                            trait_type: "Passive",
                            value: attributes.passive[i + 4]
                        },
                    ]
                }
                var buf = Buffer.from(JSON.stringify(metadata));
                const formData = new FormData()
                formData.append('File', buf);
                const options = { method: 'POST', body: formData };
                cmpromise.push(fetch('http://127.0.0.1:5001/api/v1/add', options))
            }
            let cmFetch = await Promise.all(cmpromise);
            let cmJson = [];
            for (let i = 0; i < cmFetch.length; i++) {
                cmJson.push(cmFetch[i].json());
            }
            let cmVal = await Promise.all(cmJson);

            return res.status(200).send({ error: false, nms: nmsVal.map(item => item.Hash), cs: csVal.map(item => item.Hash), cm: cmVal.map(item => item.Hash) });

        } else {
            return res.status(422).send({ error: true, message: "method_not_supported" });
        }
    } catch (e) {
        return res.status(422).send({ error: true, message: e.message });
    }

};

export default handler;
