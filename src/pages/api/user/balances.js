import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { address } = req.query;
        if (address) {
            try {
                let getAssetIssueListReq = await fetch(
                    `${process.env.covalenthqAPI}/v1/80001/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env.covalenthqKey}`,
                    {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    });

                let getAssetIssueListRes = await getAssetIssueListReq.json();
                let availableTokens = [];
                let tokens = getAssetIssueListRes.data.items;
                if (tokens && tokens.length) {
                    for (let i = 0; i < tokens.length; i++) {
                        availableTokens.push({
                            amount: tokens[i]["quote"],
                            balance: tokens[i]["balance"],
                            name: tokens[i]["contract_name"],
                            tokenAbbr: tokens[i]["contract_ticker_symbol"],
                            tokenDecimal: tokens[i]["contract_decimals"],
                            tokenId: tokens[i]["contract_address"],
                            tokenLogo: tokens[i]["logo_url"]
                        })
                    }
                }
                return res.status(200).send(availableTokens);
            } catch (error) {
                return res.status(500).send(error);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);