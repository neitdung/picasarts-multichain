import React from 'react';
import {
    Heading,
    Avatar,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Link,
    Button
} from '@chakra-ui/react';
import NextLink from 'next/link';
import HammerIcon from '../icons/Hammer';
import BagIcon from '../icons/Bag';
import { ethers } from 'ethers';
export default function NFTCard({
    name,
    image,
    bg,
    editImage,
    creator_name,
    creatorAddress,
    price,
    background_color,
    canEdit,
    contract_address,
    token_id,
    auction,
    tokenInfo
}) {
    return (
        <Box
            maxW={320}
            w={'full'}
            bg={'white'}
            boxShadow={'2xl'}
            rounded={'md'}
            borderRadius={20}
            overflow={'hidden'}>
            <Box w={'full'} bgColor={background_color ? background_color : bg} p={4}>
                <Image
                    h={300}
                    w={'full'}
                    src={
                        editImage ? URL.createObjectURL(image) : image ? image.replace("ipfs://", "http://127.0.0.1:8080/btfs/") : 'https://picsum.photos/300/300'
                    }
                    objectFit={'cover'}
                    borderRadius={10}
                />
            </Box>
            <Box px={4} borderBottomRadius={4} border={'1px solid gray.100'}>
                <Stack spacing={2} align={'left'} mb={2}>
                    <Heading textAlign='left' fontWeight={700} fontFamily={'body'}>
                        <NextLink href={`/nft/${contract_address}/${token_id}/buy`} passHref><Link fontSize={'md'} >{name ? name : "NFT Name"}</Link></NextLink>
                    </Heading>
                    <Text fontSize={'sm'}>Created by <NextLink href={`/artist/${creatorAddress}`} passHref><Link fontWeight={700}>{creator_name}</Link></NextLink></Text>
                </Stack>
            </Box>
            <Box p={4} bgColor={'gray.200'}>
                <Flex justify={'space-between'} align={'center'}>
                    <Flex gap={2} alignItems='center'>
                        <Image h={6} src={tokenInfo.tokenLogo} />
                        {price && <Text fontWeight={700}>{ethers.utils.formatUnits(price, tokenInfo.tokenDecimal)} {tokenInfo.tokenAbbr}</Text>}
                    </Flex>
                    {canEdit ?
                        <NextLink href={`/nft/${contract_address}/${token_id}/list`} passHref>
                            <Link _hover={{
                                textDecoration: 'none'
                            }} >
                                <Button color={'white'}
                                    bgGradient='linear(to-r, #f5505e, #ef1399)'
                                    _hover={{
                                        bg: 'pink.300',
                                    }}>List</Button>
                            </Link>
                        </NextLink>
                        : auction ?
                            <NextLink href={`/nft/${contract_address}/${token_id}/buy`} passHref>
                                <Link _hover={{
                                    textDecoration: 'none'
                                }} >
                                    <Button color={'white'}
                                        leftIcon={<HammerIcon />}
                                        bgGradient='linear(to-r, #f5505e, #ef1399)'
                                        _hover={{
                                            bg: 'pink.300',
                                        }}>Place a bid</Button>
                                </Link>
                            </NextLink>
                            :
                            <NextLink href={`/nft/${contract_address}/${token_id}/buy`} passHref>
                                <Link _hover={{
                                    textDecoration: 'none'
                                }} >
                                    <Button color={'white'}
                                        bgGradient='linear(to-r, #f5505e, #ef1399)'
                                        leftIcon={<BagIcon />}
                                        _hover={{
                                            bg: 'pink.300',
                                        }}>Buy now</Button>
                                </Link>
                            </NextLink>
                    }
                </Flex>
            </Box>
        </Box>
    );
}