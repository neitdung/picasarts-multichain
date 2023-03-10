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
                        <Link pr={1}
                            as={NextLink}
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
                        <Link pr={1}
                            as={NextLink}
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
                        <Link pr={1}
                            as={NextLink}
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
                        <Link href={'#'}
                            as={NextLink}
                            fontSize={'md'}
                            fontWeight={700}
                            color={'pink.400'}
                            _hover={{
                                textDecoration: 'none',
                                color: linkHoverColor,
                            }}>
                            <LinkIcon />
                        </Link>
                    </Stack>
                </Stack>
                <Divider orientation='vertical' h={'3xs'} pr={20} />
                <SimpleGrid columns={{ base: 1, sm: 2, md: 6 }} spacing={8} >
                    <Stack align={'flex-start'}>
                        <ListHeader>Explore</ListHeader>
                        <Link as={NextLink} href={'#'}>Marketplace</Link>
                        <Link as={NextLink} href={'#'}>Collections</Link>
                        <Link as={NextLink} href={'#'}>Artists</Link>
                        <Link as={NextLink} href={'#'}>Loan</Link>
                        <Link as={NextLink} href={'#'}>Farm</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Apply</ListHeader>
                        <Link as={NextLink} href={'#'}>Apply for Artists</Link>
                        <Link as={NextLink} href={'#'}>Apply for Launchpad</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Tracking</ListHeader>
                        <Link as={NextLink} href={'#'}>Activities</Link>
                        <Link as={NextLink} href={'#'}>NFT Ranking</Link>
                        <Link as={NextLink} href={'#'}>Collection Ranking</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Resources</ListHeader>
                        <Link as={NextLink} href={'#'}>Blog</Link>
                        <Link as={NextLink} href={'#'}>Community</Link>
                        <Link as={NextLink} href={'#'}>Guide</Link>
                        <Link as={NextLink} href={'#'}>Help Center</Link>
                        <Link as={NextLink} href={'#'}>Newsletter</Link>
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