import React from "react";
import {
    Box,
    Flex,
    Stack,
    Image,
    Button,
    Skeleton,
    SimpleGrid
} from '@chakra-ui/react';
import NextLink from 'next/link';
import collectionImg1 from 'src/public/static/images/collection_1.png';
import collectionImg2 from 'src/public/static/images/collection_2.png';
import collectionImg3 from 'src/public/static/images/collection_3.png';
import collectionImg4 from 'src/public/static/images/collection_4.png';
import nftImg1 from 'src/public/static/images/nft_1.png';

export default function Create() {
    return (
        <Flex w={'full'} py={12} bg={'gray.100'} justify={'center'} gap={20}>
            <Box
                role={'group'}
                p={6}
                maxW={'330px'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}>
                <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={220}
                >
                    <SimpleGrid columns={2} spacing={5}>
                        <Image
                            rounded={'lg'}
                            h={100}
                            width={'full'}
                            objectFit={'cover'}
                            src={collectionImg1.src}
                        />
                        <Image
                            rounded={'lg'}
                            width={'full'}
                            h={100}
                            objectFit={'cover'}
                            src={collectionImg2.src}
                        />
                        <Image
                            rounded={'lg'}
                            width={'full'}
                            h={100}
                            objectFit={'cover'}
                            src={collectionImg3.src}
                        />
                        <Image
                            rounded={'lg'}
                            width={'full'}
                            h={100}
                            objectFit={'cover'}
                            src={collectionImg4.src}
                        />
                    </SimpleGrid>

                </Box>
                <Stack pt={5} align={'center'} gap={2}>
                    <Skeleton w={'full'} startColor='#f5505e' endColor='#ef1399' h={5} />
                    <Skeleton w={'full'} startColor='#f5505e' endColor='#ef1399' h={5} />
                    <Skeleton w={'full'} startColor='#f5505e' endColor='#ef1399' h={5} />
                    <NextLink href={'/collection/create'} as={'/collection/create'}>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            color={'white'}
                            w={'full'}
                            bgGradient='linear(to-r, #f5505e, #ef1399)'
                            _hover={{
                                bg: 'pink.300',
                            }}
                        >
                            COLLECTION
                        </Button>
                    </NextLink>
                </Stack>
            </Box>
            <Box
                role={'group'}
                p={6}
                maxW={'330px'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}>
                <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={220}
                >
                    <Image
                        rounded={'lg'}
                        height={220}
                        width={282}
                        objectFit={'cover'}
                        src={nftImg1.src}
                    />
                </Box>
                <Stack pt={5} align={'center'} gap={2}>
                    <Skeleton w={'full'} startColor='pink.500' endColor='orange.500' h={5} />
                    <Skeleton w={'full'} startColor='pink.500' endColor='orange.500' h={5} />
                    <Skeleton w={'full'} startColor='pink.500' endColor='orange.500' h={5} />
                    <NextLink href={'/nft/create'} as={'/nft/create'}>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            color={'white'}
                            w={'full'}
                            bgGradient='linear(to-r, #f5505e, #ef1399)'
                            _hover={{
                                bg: 'pink.300',
                            }}
                        >
                            NFT
                        </Button>
                    </NextLink>
                </Stack>
            </Box>
            <Box
                role={'group'}
                p={6}
                maxW={'330px'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}>
                <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={220}
                >
                    <Image
                        rounded={'lg'}
                        height={220}
                        width={282}
                        objectFit={'cover'}
                        src={collectionImg1.src}
                    />
                </Box>
                <Stack pt={5} align={'center'} gap={2}>
                    <Skeleton w={'full'} startColor='pink.500' endColor='orange.500' h={5} />
                    <Skeleton w={'full'} startColor='pink.500' endColor='orange.500' h={5} />
                    <Skeleton w={'full'} startColor='pink.500' endColor='orange.500' h={5} />
                    <NextLink href={'/farm/create'} as={'/farm/create'}>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            color={'white'}
                            w={'full'}
                            bgGradient='linear(to-r, #f5505e, #ef1399)'
                            _hover={{
                                bg: 'pink.300',
                            }}
                        >
                            FARM
                        </Button>
                    </NextLink>
                </Stack>
            </Box>
        </Flex>
    );
}