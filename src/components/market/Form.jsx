import React, { useState, useEffect } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Switch,
    NumberInput,
    NumberInputField,
    Flex,
    VStack,
    Divider,
    Select,
    Image,
    ButtonGroup,
    useToast,
    Text,
    FormHelperText,
    Input
} from "@chakra-ui/react";
import { BigNumber, ethers } from 'ethers';
import NotConnected from '../common/NotConnected';
import { noneAddress, marketAddress } from 'src/state/chain/config';
import { createNftContractWithSigner, parseDuration } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/market/thunks/loadContract';
import { useRouter } from 'next/router';

export default function MarketForm({ ipnft, listed }) {
    const [contractAddress, tokenId] = ipnft.split("@");
    const dispatch = useDispatch();
    const { account, tokens } = useSelector(state => state.chain);
    const { signer, loaded, contract } = useSelector(state => state.market);
    const [isLoading, setIsLoading] = useState(false);
    const [marketData, setMarketData] = useState({});
    const [tokenIndex, setTokenIndex] = useState(0);
    const [price, setPrice] = useState(0);
    const [auction, setAuction] = useState(false);
    const [duration, setDuration] = useState("");
    const [nftSigner, setNftSigner] = useState({});
    const [timeEnd, setTimeEnd] = useState("");
    const router = useRouter();
    const toast = useToast();

    const loadMarketData = async () => {
        let data = await contract.getMarketData(contractAddress.toLowerCase(), BigNumber.from(tokenId));
        let nftContract = createNftContractWithSigner(contractAddress);
        setNftSigner(nftContract);
        setMarketData(data[0]);
        let tIndex = tokens.list.findIndex(item => item.address.toLowerCase() === data[0].ftContract.toLowerCase());
        setTokenIndex(tIndex !== -1 ? tIndex : 0);
        if (data[0]?.price) {
            setPrice(parseFloat(ethers.utils.formatUnits(data[0].price, tokens.list[tIndex].decimals)));
        }
        if (data[0].hasOwnProperty("auction")) {
            setAuction(data[0].auction);
        }

        if (data[1].hasOwnProperty("timeEnd")) {
            let timeUnix = 1000 * data[1].timeEnd.toNumber();
            let dateObj = new Date(timeUnix);
            setTimeEnd(dateObj.toLocaleString());
        }
    }

    useEffect(() => {
        if (loaded) {
            loadMarketData();
        } else {
            dispatch(loadContract())
        }
    }, [loaded]);

    useEffect(() => {
        if (tokens.load && tokens.list.length) {
            setTokenIndex(0)
        }
    }, [tokens.loaded])

    const listItem = async () => {
        setIsLoading(true);
        try {
            if (auction) {
                let convertData = parseDuration(duration);

                if (convertData.error) {
                    throw {message: "Duration is not approved."};
                } else {
                    let priceWei = ethers.utils.parseUnits(price.toString(), tokens.list[tokenIndex].decimals);
                    let approveTx = await nftSigner.approve(marketAddress, tokenId);
                    await approveTx.wait();
                    let listTx = await signer.bidding(
                        contractAddress,
                        tokens.list[tokenIndex].address,
                        tokenId,
                        priceWei,
                        BigNumber.from(convertData.result)
                    );
                    await listTx.wait();
                }
            } else {
                let priceWei = ethers.utils.parseUnits(price.toString(), tokens.list[tokenIndex].decimals);
                let approveTx = await nftSigner.approve(marketAddress, tokenId);
                await approveTx.wait();
                let listTx = await signer.list(contractAddress, tokens.list[tokenIndex].address, tokenId, priceWei);
                await listTx.wait();
            }
            toast({
                title: "List NFT success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.reload();
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const switchList = async () => {
        setIsLoading(true);
        try {
            let priceWei = ethers.utils.parseUnits(price.toString(), tokens.list[tokenIndex].decimals);
            let convertData = parseDuration(duration);
            if (convertData.error && auction) {
                throw { message: "Duration is not approved." };
            } else {
                let durationData = auction ? convertData.result : 0;
                let switchTx = await signer.edit(marketData.itemId,
                    tokens.list[tokenIndex].address,
                    priceWei,
                    auction,
                    BigNumber.from(durationData)
                );
                await switchTx.wait();

                toast({
                    title: "Switch list NFT success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                router.reload();
            }
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    const unlist = async () => {
        setIsLoading(true);
        try {
            let unlistTx = await signer.unlist(marketData.itemId);
            await unlistTx.wait();
            setIsLoading(false);
            toast({
                title: "Unlist NFT success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.reload();
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const relist = async () => {
        try {
            setIsLoading(true);
            let priceWei = ethers.utils.parseUnits(price.toString(), tokens.list[tokenIndex].decimals);
            let approveTx = await nftSigner.approve(marketAddress, tokenId);
            await approveTx.wait();
            if (auction) {
                let convertData = parseDuration(duration);
                if (convertData.error) {
                    throw { message: "Duration is not approved." };
                } else {
                    let listTx = await signer.reauction(marketData.itemId,
                        tokens.list[tokenIndex].address,
                        priceWei,
                        BigNumber.from(convertData.result));
                    await listTx.wait();
                }
            } else {
                let listTx = await signer.relist(marketData.itemId, tokens.list[tokenIndex].address, priceWei);
                await listTx.wait();
            }
            router.reload()
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const handleTokenChange = (e) => {
        setTokenIndex(e.target.value)
    }

    if (!account) return <NotConnected />
    return (
        <VStack bg="white" borderRadius={10} align='left'>
            <Divider />
            <Flex gap={20} w={'full'}>
                <FormControl>
                    <FormLabel fontWeight={700}>Token</FormLabel>
                    <Select w={'full'} value={tokenIndex} icon={<Image src={tokens.list[tokenIndex].logo} />} onChange={handleTokenChange}>
                        {(tokens.list.length) && tokens.list.map((item, index) => <option ket={item.address} value={index}>{item.name} - {item.symbol}</option>)}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel fontWeight={700}>Is Auction</FormLabel>
                    <Switch id="auction" isChecked={auction} onChange={_ => setAuction(!auction)} />
                </FormControl>
            </Flex>
            <FormControl id="price">
                <FormLabel fontWeight={700}>Price</FormLabel>
                <NumberInput value={price}>
                    <NumberInputField onChange={e => setPrice(e.target.value)} />
                </NumberInput>
            </FormControl>
            {auction &&
                <FormControl>
                    <FormLabel fontWeight={700}>Duration</FormLabel>
                    <Input value={duration} onChange={e => setDuration(e.target.value)} />
                    <FormHelperText>Eg: 1d 2h 3m 4s. If result is 0s, auction will not limit.</FormHelperText>
                </FormControl>
            }
            {(marketData?.auction && marketData?.listed) && <Text>Ending bid time: {timeEnd}</Text>}
            {(!listed && marketData?.nftContract == noneAddress) && <Flex w='full' justifyContent={'center'}>
                <Button isLoading={isLoading} colorScheme='red' mx='auto' onClick={listItem} w={'50%'}>
                    List NFT
                </Button>
            </Flex>}
            {(listed) &&
                <ButtonGroup gap={10} w={'full'}>
                    <Button isLoading={isLoading} onClick={switchList} w={'full'} variant='outline' colorScheme='pink'>Switch list type</Button>
                    <Button isLoading={isLoading} onClick={unlist} w={'full'} variant='outline' colorScheme='tomato'>Unlist Item</Button>
                </ButtonGroup>
            }
            {(!listed && marketData?.nftContract != noneAddress) &&
                <Button isLoading={isLoading} onClick={relist} variant='outline' w={"50%"} colorScheme='tomato'>Relist</Button>
            }
        </VStack>
    );
}