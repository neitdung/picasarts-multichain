import React from 'react';
import {
    Heading,
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
// import BagIcon from '../icons/Bag';
import { ViewIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { shortenAddress } from 'src/state/util';

export default function NFTCard({
    name,
    image,
    bg,
    editImage,
    creator_address,
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
                        editImage ? URL.createObjectURL(editImage) : image ? `http://127.0.0.1:8080/btfs/${image}` : 'https://picsum.photos/300/300'
                    }
                    objectFit={'cover'}
                    borderRadius={10}
                />
            </Box>
            <Box px={4} borderBottomRadius={4} border={'1px solid gray.100'}>
                <Stack spacing={2} align={'left'} mb={2}>
                    <Heading textAlign='left' fontWeight={700} fontFamily={'body'}>
                        <Link href={`/nft/${contract_address}@${token_id}`} as={NextLink} fontSize={'md'} >{name ? name : "NFT Name"}</Link>
                    </Heading>
                    <Text fontSize={'sm'}>Created by {''}<Link as={NextLink} href={`/artist/${creator_address}`} passHref>{shortenAddress(creator_address)}</Link></Text>
                </Stack>
            </Box>
            <Box p={4} bgColor={'gray.200'}>
                <Flex justify={'space-between'} align={'center'}>
                    <Flex gap={2} alignItems='center'>
                        <Image h={6} src={tokenInfo?.logo} />
                        {price && <Text fontWeight={700}> {tokenInfo ? ethers.utils.formatUnits(price, tokenInfo.decimal) : 0} {tokenInfo.symbol}</Text>}
                    </Flex>
                    {canEdit ?
                        <Link
                            as={NextLink}
                            href={`/nft/${contract_address}@${token_id}/list`}
                            _hover={{
                                textDecoration: 'none'
                            }} >
                            <Button color={'white'}
                                bgGradient='linear(to-r, #f5505e, #ef1399)'
                                leftIcon={<HammerIcon />}
                                _hover={{
                                    bg: 'pink.300',
                                }}>List</Button>
                        </Link>
                        : 
                            <Link
                                href={`/nft/${contract_address}@${token_id}`}
                                _hover={{
                                    textDecoration: 'none'
                                }} >
                                <Button color={'white'}
                                    bgGradient='linear(to-r, #f5505e, #ef1399)'
                                    leftIcon={<ViewIcon />}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}>View</Button>
                            </Link>
                    }
                </Flex>
            </Box>
        </Box>
    );
}