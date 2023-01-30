import React, { useCallback, useContext, useEffect } from 'react';
import {
    Box,
    Flex,
    InputGroup,
    InputLeftAddon,
    Select,
    Input,
    Button,
    Stack,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    Image,
} from '@chakra-ui/react';
import {
    LinkIcon,
} from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NextLink from 'next/link';
import logo from 'src/public/static/logo.png';
import Network from './Network';
import NavItem from './NavItem';
const NAV_ITEMS = [
    {
        label: 'Explore',
        children: [
            {
                label: 'Collections',
                href: '/collections',
            },
            {
                label: 'Marketplace',
                href: '/market',
            },
            {
                label: 'Loan',
                href: '/loan',
            },
            {
                label: 'Rental',
                href: '/rental',
            },
            {
                label: 'Artists',
                href: '#',
            },
        ],
    },
    {
        label: 'Apply',
        children: [
            {
                label: 'Apply for Artist',
                href: '#',
            },
            {
                label: 'Apply for Launchpad',
                href: '#',
            },
        ],
    },
    {
        label: 'Tracking',
        children: [
            {
                label: 'Activities',
                href: '#',
            },
            {
                label: 'NFT Ranking',
                href: '#',
            },
            {
                label: 'Collection Ranking',
                href: '#',
            }
        ],
    },
    {
        label: 'Resources',
        children: [
            {
                label: 'Blog',
                href: '#',
            },
            {
                label: 'Community',
                href: '#',
            },
            {
                label: 'Guide',
                href: '#',
            },
            {
                label: 'Help Center',
                href: '#',
            },
            {
                label: 'Newsletter',
                href: '#',
            }
        ],
    },
];

export default function AppBar() {
    const linkHoverColor = useColorModeValue('blue.700', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4, md: 20 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                <NextLink href={"/"}><Image src={logo.src} alt='Picarsart.io' h={30} /></NextLink>
                <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }} ml={8}>
                    <InputGroup width='auto'  >
                        <InputLeftAddon p={0} >
                            <Select placeholder='All Items' focusBorderColor={'unset'} w={'full'} borderRightRadius={0}>
                                <option value='collections'>Collections</option>
                                <option value='artists'>Artists</option>
                            </Select>
                        </InputLeftAddon>
                        <Input htmlSize={30} placeholder='Enter your search here...' />
                    </InputGroup>
                    <NextLink href='/create' passHref>
                        <Link>
                            <Button mx={4} variant={'solid'} colorScheme='pink'>
                                Create
                            </Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/import' passHref>
                        <Link>
                            <Button variant={'outline'} colorScheme='purple'>
                                Import
                            </Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/admin' passHref>
                        <Link>
                            <Button mx={4} variant={'outline'}>
                                Admin
                            </Button>
                        </Link>
                    </NextLink>
                </Flex>
                <Network />
            </Flex>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4, md: 20 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Flex display={{ base: 'none', md: 'flex' }}>
                        <Stack direction={'row'} spacing={4}>
                            {NAV_ITEMS.map((navItem) => (
                                <Box key={navItem.label} >
                                    <Popover trigger={'hover'} placement={'bottom-start'}>
                                        <PopoverTrigger>
                                            <Link
                                                pr={2}
                                                py={2}
                                                fontSize={'sm'}
                                                fontWeight={700}
                                                bgGradient='linear(to-r, #f5505e, #ef1399)'
                                                bgClip='text'
                                                _hover={{
                                                    textDecoration: 'none',
                                                    color: linkHoverColor,
                                                }}>
                                                {navItem.label}
                                            </Link>
                                        </PopoverTrigger>
                                        {navItem.children && (
                                            <PopoverContent
                                                border={0}
                                                boxShadow={'xl'}
                                                bg={popoverContentBgColor}
                                                p={4}
                                                rounded={'xl'}
                                                minW={'min'}>
                                                <Stack>
                                                    {navItem.children.map((child) => (
                                                        <NavItem key={child.label} {...child} />
                                                    ))}
                                                </Stack>
                                            </PopoverContent>
                                        )}
                                    </Popover>
                                </Box>
                            ))}
                        </Stack>
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    <NextLink href={'#'} passHref>
                        <Link
                            pr={2}
                            py={2}
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
                    </NextLink>
                    <NextLink href={'#'} passHref>
                        <Link
                            pr={2}
                            py={2}
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
                        <Link
                            pr={2}
                            py={2}
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
                        <Link
                            py={2}
                            href={'#'}
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
            </Flex>
        </Box>
    );
}