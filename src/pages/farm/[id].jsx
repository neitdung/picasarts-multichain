import React, { useContext, useState, useEffect } from 'react';
import {
    Skeleton,
    Button,
    Image,
    Box,
    Divider,
    Text,
    Flex,
    Stack,
    Link,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    NumberInput,
    NumberInputField,
    Wrap,
    WrapItem,
    Center,
    IconButton,
    SkeletonCircle,
    SkeletonText
} from "@chakra-ui/react";
import { appStore, getTokens, createFtContractWithSigner, createNftContract, createNftContractWithSigner } from 'src/state/app';
import NextLink from 'next/link';
import { addressNone, rentalAddress } from 'src/config/contractAddress';
import { UnlockIcon, LockIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { getCollectionItems } from 'src/state/collection';

export default function FarmInfo({ id }) {
    const { state, dispatch } = useContext(appStore);
    const {
        mounted,
        wallet: { signer: { _address } },
        farmContract,
        tokens
    } = state;
    const [farmData, setFarmData] = useState({});
    const [tokenInfo, setTokenInfo] = useState(tokens[0]);
    const [acceptTokens, setAcceptTokens] = useState([]);
    const [lockedTokens, setLockedTokens] = useState([]);
    const [availableTokens, setAvailableTokens] = useState([]);

    const [reward, setReward] = useState(100);
    const [tabIndex, setTabIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const handleTabsChange = (index) => {
        setTabIndex(index)
    }
    const loadFarmData = async () => {
        let data = await farmContract.obj.getFarm(id);
        setFarmData(data);
        console.log(data)
        let tokenIds = [];
        let tokenToFarmerId = [];
        data.tokenIds.forEach(item => {
            tokenIds.push(item.toString())
        });
        data.tokenToFarmerId.forEach(item => {
            tokenToFarmerId.push(item.toString())
        });
        let listNfts = await getCollectionItems(data.nftContract);
        let listAccept = listNfts.filter(item => tokenIds.includes(item.token_id));
        const nftContract = createNftContract(data.nftContract);
        let balanceNft = await nftContract.balanceOf(_address);
        let convertBalance = balanceNft.toNumber();
        let fetchIds = [];
        for (let i = 0; i < convertBalance; i++) {
            fetchIds.push(nftContract.tokenOfOwnerByIndex(_address, i));
        }
        let ids = await Promise.all(fetchIds);
        let mIds = ids.map(item => item.toString());
        setAcceptTokens(listAccept);
        setAvailableTokens(listAccept.filter(item => mIds.includes(item.token_id)));
        setLockedTokens(listAccept.filter((_, index) => data.farmers[tokenToFarmerId[index]] == _address));
        setIsLoading(false);
    }

    const addReward = async () => {
        let amount = ethers.utils.parseUnits(reward, tokenInfo.tokenDecimal);
        if (farmData.seedId == addressNone) {
            await farmContract.obj.addReward(id, addressNone, amount, { value: amount });
        } else {
            let erc20 = createFtContractWithSigner(farmData.seedId);
            await erc20.approve(
                rentalAddress,
                amount
            );
            erc20.once("Approval", async (from, to, value, event) => { 
                await farmContract.obj.addReward(id, farmData.seedId, amount);
            }
            )
        }
    }

    const deposit = async (tokenId) => {
        let nftSigner = createNftContractWithSigner(farmData.nftContract);
        setIsLoading(true);
        await nftSigner.approve(rentalAddress, tokenId);
        nftSigner.once("Approval", async (from, to, token_id, event) => {
            await farmContract.obj.depositNft(farmData.nftContract, tokenId, id);
            setIsLoading(false);
        })
    }

    const withdraw = async (tokenId) => {
        let tokenIndex = acceptTokens.findIndex(item => item == tokenId);
        if (tokenIndex != -1) {
            await farmContract.obj.withdrawNft(id, tokenIndex);
        }
    }

    const claim = async () => {
        await farmContract.obj.obj.claimReward(id);
    }

    useEffect(() => {
        if (tokens.length >= 1) {
            let token = tokens.find(item => item?.tokenId?.toUpperCase() == farmData?.seedId?.toUpperCase());
            setTokenInfo(token);
        }
    }, [tokens, farmData]);

    useEffect(() => {
        if (mounted &&_address) {
            loadFarmData();
            // dispatch(getTokens());
        }
    }, [mounted, _address]);

    if (!mounted) return <Skeleton h={'80vh'} />

    return (
        <Box bgColor={'gray.100'}>
            <Flex p={20} bgColor={'white'} bgClip='content-box'>
                <Flex borderBottomRadius={4} borderWidth={2} px={8} py={4} w={'min'}>
                    <Stack spacing={2} align={'left'} mb={2} w={'full'}>
                        <Text fontWeight={700}>Farm Info</Text>
                        <Text fontWeight={700}>Owner: {farmData?.owner}</Text>
                        <Text>NFT contract: {farmData?.nftContract}</Text>
                        <Text>Balance Staked: {farmData?.pointBalance?.toNumber()}</Text>
                        <Text>RPS: {farmData?.rps?.toNumber()} / Session Interval: {farmData?.sessionInterval?.toNumber()}s</Text>
                        <Text>Start At: {new Date(farmData?.startAt?.toNumber() * 1000).toDateString()}</Text>
                        <Text>Total reward: {(farmData?.total) && ethers.utils.formatUnits(farmData.total, tokenInfo?.tokenDecimal)} / Undistributed: {(farmData?.undistributed) && ethers.utils.formatUnits(farmData.undistributed, tokenInfo?.tokenDecimal)}</Text>
                        <Text>
                            Reward Info: <Link target={'blank'}
                                href={`#`}>
                                {tokenInfo?.tokenAbbr}
                            </Link>
                        </Text>
                        {(farmData?.owner == _address) && <Flex gap={2}>
                            <NumberInput value={reward}>
                                <NumberInputField onChange={e => setReward(e.target.value)} />
                            </NumberInput>
                            <Button w='min' onClick={addReward}>Add reward</Button>
                        </Flex>}
                        {(farmData?.owner != _address) && <Flex gap={2}>
                            <Button w='full' onClick={claim} >Claim</Button>
                            <Button w='full' onClick={() => setTabIndex(1)}>Deposit</Button>
                            <Button w='full' onClick={() => setTabIndex(2)}>Withdraw</Button>
                        </Flex>}
                    </Stack>
                    <Center p={10} w={'full'}>{tokenInfo?.tokenLogo && tokenInfo.tokenLogo.includes("http") && <Image minW={'60px'} src={tokenInfo?.tokenLogo} />}</Center>
                </Flex>
                <Tabs isFitted variant='enclosed' w={'full'} borderBottomRadius={4} borderWidth={2} index={tabIndex} onChange={handleTabsChange}>
                    <TabList mb='1em'>
                        <Tab>Accepted NFTs</Tab>
                        <Tab>Available</Tab>
                        <Tab>Locked</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {(isLoading) && <Box padding='6' boxShadow='lg' bg='white'>
                                <SkeletonCircle size='10' />
                                <SkeletonText mt='4' noOfLines={4} spacing='4' />
                            </Box>}
                            <Wrap spacing='30px' justify='center'>
                                {acceptTokens.map(item =>
                                    <WrapItem key={`accept${item.token_id}`}>
                                        <Flex w='180px' h='80px' borderColor={item.background_color} borderWidth='5px' align='center' gap={2} justify='space-between'>
                                            <NextLink href={`/nft/${item.contract_address}/${item.token_id}/buy`} passHref>
                                                <Link>{item.name.length > 6 ? item.name.substring(0, 10) + "..." : item.name}</Link>
                                            </NextLink>
                                            <Image src={item.image.replace("ipfs://", "http://127.0.0.1:8080/ipfs/")} h={'full'} objectFit='cover' maxW={'90px'} />
                                        </Flex>
                                    </WrapItem>
                                )}
                            </Wrap>
                        </TabPanel>
                        <TabPanel>
                            {(isLoading) && <Box padding='6' boxShadow='lg' bg='white'>
                                <SkeletonCircle size='10' />
                                <SkeletonText mt='4' noOfLines={4} spacing='4' />
                            </Box>}
                            <Wrap spacing='30px' justify='center'>
                                {availableTokens.map(item =>
                                    <WrapItem key={`accept${item.token_id}`}>
                                        <Flex w='220px' align='center'>
                                            <IconButton icon={<LockIcon />} onClick={() => deposit(item.token_id)} />
                                            <Flex w='180px' h='80px' borderColor={item.background_color} borderWidth='5px' align='center' gap={2} justify='space-between'>
                                                <NextLink href={`/nft/${item.contract_address}/${item.token_id}/buy`} passHref>
                                                    <Link>{item.name.length > 6 ? item.name.substring(0, 10) + "..." : item.name}</Link>
                                                </NextLink>
                                                <Image src={item.image.replace("ipfs://", "http://127.0.0.1:8080/ipfs/")} h={'full'} objectFit='cover' maxW={'90px'} />
                                            </Flex>
                                        </Flex>
                                    </WrapItem>
                                )}
                            </Wrap>
                        </TabPanel>
                        <TabPanel>
                            {(isLoading) && <Box padding='6' boxShadow='lg' bg='white'>
                                <SkeletonCircle size='10' />
                                <SkeletonText mt='4' noOfLines={4} spacing='4' />
                            </Box>}
                            <Wrap spacing='30px' justify='center'>
                                {lockedTokens.map(item =>
                                    <WrapItem key={`locked${item.token_id}`}>
                                        <Flex w='220px' align='center'>
                                            <IconButton icon={<UnlockIcon />} onClick={() => withdraw(item.token_id)} />
                                            <Flex w='220px' align='center'>
                                                <IconButton icon={<UnlockIcon />} onClick={() => withdraw(item.token_id)} />
                                                <Flex w='180px' h='80px' borderColor={item.background_color} borderWidth='5px' align='center' gap={2} justify='space-between'>
                                                    <NextLink href={`/nft/${item.contract_address}/${item.token_id}/buy`} passHref>
                                                        <Link>{item.name.length > 6 ? item.name.substring(0, 10) + "..." : item.name}</Link>
                                                    </NextLink>
                                                    <Image src={item.image.replace("ipfs://", "http://127.0.0.1:8080/ipfs/")} h={'full'} objectFit='cover' maxW={'90px'} />
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </WrapItem>
                                )}
                            </Wrap>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
            <Divider />
        </Box>
    );
}

FarmInfo.getInitialProps = async ({ query }) => {
    return {
        id: query.id,
    }
}