import React from 'react';

import {
    Box,
    Container,
    Stack,
    SimpleGrid,
    Text,
    Link,
    useColorModeValue,
    InputGroup,
    Input,
    IconButton,
    InputRightElement,
    Divider,
    Image
} from '@chakra-ui/react';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import {
    LinkIcon,
    ArrowForwardIcon
} from '@chakra-ui/icons';
import logo from 'src/public/static/logo.png';
import NextLink from 'next/link';
const ListHeader = ({ children }) => {
    return (
        <>
            <Text bgGradient='linear(to-r, #f5505e, #ef1399)'
                bgClip='text' fontWeight={'700'} fontSize={'lg'}
            >
                {children}
            </Text>
            <Divider w={8} borderBottomWidth={3} borderColor='pink.400' />
        </>
    );
};

export default function Footer() {
    const linkHoverColor = useColorModeValue('blue.700', 'white');
    return (
        <Box
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container as={Stack} py={10} maxW={'full'} px={{ base: 4, md: 20 }} direction='row'>
                <Stack spacing={6} pr={20}>
                    <Box>
                        <Image src={logo.src} alt='Picarsart.io on TRON' h={30} />
                    </Box>

                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={4}>
                        <NextLink href={'#'} passHref>
                            <Link pr={1}
                                href={'#'}
                                fontSize={'md'}
                                fontWeight={700}
                                color={'blue.500'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                <FacebookIcon />
                            </Link>
                        </NextLink>                        <NextLink href={'#'} passHref>
                            <Link pr={1}
                                href={'#'}
                                fontSize={'md'}
                                fontWeight={700}
                                color={'pink.400'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                <InstagramIcon />
                            </Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link pr={1}
                                href={'#'}
                                fontSize={'md'}
                                fontWeight={700}
                                color={'blue.500'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                <TwitterIcon />
                            </Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}
                                fontSize={'md'}
                                fontWeight={700}
                                color={'pink.400'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                <LinkIcon />
                            </Link>
                        </NextLink>
                    </Stack>
                </Stack>
                <Divider orientation='vertical' h={'3xs'} pr={20} />
                <SimpleGrid columns={{ base: 1, sm: 2, md: 6 }} spacing={8} >
                    <Stack align={'flex-start'}>
                        <ListHeader>Explore</ListHeader>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Marketplace</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Collections</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Artists</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Loan</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Farm</Link>
                        </NextLink>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Apply</ListHeader>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Apply for Artists</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Apply for Launchpad</Link>
                        </NextLink>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Tracking</ListHeader>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Activities</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>NFT Ranking</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Collection Ranking</Link>
                        </NextLink>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Resources</ListHeader>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Blog</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Community</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Guide</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Help Center</Link>
                        </NextLink>
                        <NextLink href={'#'} passHref>
                            <Link href={'#'}>Newsletter</Link>
                        </NextLink>
                    </Stack>
                    <Stack align={'flex-start'} w={60}>
                        <ListHeader>Join Newsletter</ListHeader>
                        <Text>Sign up for our newsletter to get the latest news in your inbox</Text>
                        <InputGroup size='md'>
                            <Input
                                placeholder='Enter email'
                            />
                            <InputRightElement>
                                <IconButton
                                    borderLeftRadius={0}
                                    variant='outline'
                                    color={'white'}
                                    bgGradient='linear(to-r, #f5505e, #ef1399)'
                                    aria-label='Enter'
                                    icon={<ArrowForwardIcon />}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </Stack>
                </SimpleGrid>
            </Container>
            <Box
                borderTopWidth={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <Container
                    maxW={'6xl'}
                    pt={4}
                    textAlign={'center'}
                    align={{ md: 'center' }}>
                    <Text>© 2022 Picasarts.io All rights reserved</Text>
                </Container>
            </Box>
        </Box>
    );
}