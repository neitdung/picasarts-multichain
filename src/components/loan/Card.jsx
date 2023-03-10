import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Heading,
    Tag,
    TagLabel,
    TagLeftIcon,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Link,
    Button
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { TimeIcon, UnlockIcon, ViewIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { shortenAddress } from 'src/state/util';

export default function LoanCard({
    name,
    image,
    bg,
    borrower,
    creator_address,
    amount,
    profit,
    duration,
    background_color,
    timeExpired,
    status,
    tokenInfo,
    contract_address,
    token_id
}) {
    const timeLeft = useMemo(() => {
        const now = new Date().getTime();
        let result = timeExpired.toNumber() * 1000 - now;
        return result > 0 ? result : 0;
    }, [timeExpired])

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
                        image ? `http://127.0.0.1:8080/btfs/${image}`: 'https://picsum.photos/300/300'
                    }
                    objectFit={'cover'}
                    borderRadius={10}
                />
            </Box>
            <Flex justify={'center'} zIndex={1} mt={-4}>
                {(status == 0) &&
                    <Tag size={'lg'} variant='outline' colorScheme='purple' bg={'white'}>
                        <TagLeftIcon boxSize='12px' as={UnlockIcon} />
                        <TagLabel>--:--:--</TagLabel>
                    </Tag>}
                {(status == 1) &&
                    <Tag size={'lg'} variant='outline' colorScheme='red' bg={'white'}>
                        <TagLeftIcon boxSize='12px' as={TimeIcon} />
                        <TagLabel>{Math.floor(timeLeft / (1000 * 60 * 60 * 24))}D:{Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}H:{Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}M</TagLabel>
                    </Tag>
                }
            </Flex>
            <Box px={4} borderBottomRadius={4} border={'1px solid gray.100'}>
                <Stack spacing={2} align={'left'} mb={2}>
                    <Heading textAlign='left' fontWeight={700} fontFamily={'body'}>
                        <NextLink href={`/nft/${contract_address}@${token_id}`} passHref><Link fontSize={'md'} >{name ? name : "Collection Name"}</Link></NextLink>
                    </Heading>
                    <Text fontSize={'sm'}>Created by <NextLink href={`/artist/${creator_address}`} passHref><Link fontWeight={700}>{shortenAddress(borrower)}</Link></NextLink></Text>
                    <Text>Offer: {(amount && tokenInfo?.decimals) && ethers.utils.formatUnits(amount, tokenInfo.decimals)} {tokenInfo?.symbol} / Profit: {(profit && tokenInfo?.decimals) && ethers.utils.formatUnits(profit, tokenInfo.decimals)} {tokenInfo?.symbol}</Text>
                    <Text>Duration: {duration.toNumber()} days</Text>
                    <Text>
                        Token Info: <Link target={'blank'}
                            href={`#`}>
                            {tokenInfo?.symbol}
                        </Link>
                    </Text>
                </Stack>
            </Box>
            <Box p={4} bgColor={'gray.200'}>
                <Flex justify={'space-between'} align={'center'}>
                    <Box>
                        {tokenInfo?.logo && <Image h={8} src={tokenInfo?.logo} />}
                    </Box>
                    <NextLink href={`/nft/${contract_address}@${token_id}`} passHref>
                        <Link _hover={{
                            textDecoration: 'none'
                        }} >
                            <Button color={'white'}
                                bgGradient='linear(to-r, #f5505e, #ef1399)'
                                leftIcon={<ViewIcon />}
                                _hover={{
                                    bg: 'pink.300',
                                }}>View Covenant</Button>
                        </Link>
                    </NextLink>
                </Flex>
            </Box>
        </Box>
    );
}