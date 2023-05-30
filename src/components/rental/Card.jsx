import React, { useMemo } from 'react';
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
    Button,
    ButtonGroup
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { TimeIcon, UnlockIcon, ViewIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { formatDuration, shortenAddress } from 'src/state/util';
import HammerIcon from '../icons/Hammer';
export default function RentalCard({
    name,
    image,
    bg,
    profile,
    config,
    background_color,
    creator_address,
    tokenInfo,
    contract_address,
    canEdit=false,
    token_id
}) {
    const timeLeft = useMemo(() => {
        let timeExpired = profile.startTime.add(profile.duration.mul(config.cycleTime))
        const now = new Date().getTime();
        let result = timeExpired.toNumber() * 1000 - now;
        return result > 0 ? result : 0;
    }, [profile, config])
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
                        image ? `https://fs.picasarts.io/btfs/${image}` : 'https://picsum.photos/300/300'
                    }
                    objectFit={'cover'}
                    borderRadius={10}
                />
            </Box>
            <Flex justify={'center'} zIndex={1} mt={-4}>
                {(config.status == 1 || (config.status == 2 && timeLeft == 0)) &&
                    <Tag size={'lg'} variant='outline' colorScheme='purple' bg={'white'}>
                        <TagLeftIcon boxSize='12px' as={UnlockIcon} />
                        <TagLabel>--:--:--</TagLabel>
                    </Tag>}
                {(config.status == 2 && !timeLeft == 0) &&
                    <Tag size={'lg'} variant='outline' colorScheme='red' bg={'white'}>
                        <TagLeftIcon boxSize='12px' as={TimeIcon} />
                        <TagLabel>{Math.floor(timeLeft / (1000 * 60 * 60 * 24))}D:{Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}H:{Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}M</TagLabel>
                    </Tag>
                }
            </Flex>
            <Box px={4} borderBottomRadius={4} border={'1px solid gray.100'}>
                <Stack spacing={2} align={'left'} mb={2}>
                    <Heading textAlign='left' fontWeight={700} fontFamily={'body'}>
                        <Link fontSize={'md'} as={NextLink} href={`/nft/${contract_address}@${token_id}`} >{name ? name : "Collection Name"}</Link>
                    </Heading>
                    <Text fontSize={'sm'}>Created by <Link as={NextLink} href={`/user/${config.lender}`} fontWeight={700}>{shortenAddress(config.lender)}</Link></Text>
                    <Text>Release frequency: {(tokenInfo?.decimals) && ethers.utils.formatUnits(config.releaseFrequency, tokenInfo.decimals)} {tokenInfo?.symbol}</Text>
                    <Text>Duration: {formatDuration(config.cycleTime.toNumber())}</Text>
                    <Text>Cycle before ended: {config.cycleEnded.toNumber()}</Text>
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
                    {canEdit ?
                        <ButtonGroup>
                            <Link
                                as={NextLink}
                                href={`/nft/${contract_address}@${token_id}/list`}
                                _hover={{
                                    textDecoration: 'none'
                                }} >
                                <Button color={'white'}
                                    leftIcon={<HammerIcon />}
                                    colorScheme='red'>Edit</Button>
                            </Link>
                            <Link
                                as={NextLink}
                                href={`/nft/${contract_address}@${token_id}`}
                                _hover={{
                                    textDecoration: 'none'
                                }} >
                                <Button color={'white'}
                                    leftIcon={<ViewIcon />}
                                    colorScheme='pink'
                                >View</Button>
                            </Link>
                        </ButtonGroup>
                        :
                            <Link
                                href={`/nft/${contract_address}@${token_id}`}
                                as={NextLink}
                                _hover={{
                                textDecoration: 'none'
                            }} >
                                <Button color={'white'}
                                    bgGradient='linear(to-r, #f5505e, #ef1399)'
                                    leftIcon={<ViewIcon />}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}>View Covenant</Button>
                            </Link>
                    }
                </Flex>
            </Box>
        </Box>
    );
}