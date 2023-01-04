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
    HStack
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NextLink from 'next/link';

export default function UserCard({ name, bio, address, avatar, banner, facebook, twitter, instagram, website, editAvatar, editBanner }) {
    return (
        <Box
            maxW={500}
            w={'full'}
            bg={'white'}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}>
            <Image
                h={200}
                w={'full'}
                src={
                    editBanner ? URL.createObjectURL(banner) : banner ? `http://127.0.0.1:8080/ipfs/${banner}` : 'https://picsum.photos/500/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-8}>
                <Avatar
                    src={
                        editAvatar ? URL.createObjectURL(avatar) : avatar ? `http://127.0.0.1:8080/ipfs/${avatar}` : 'https://picsum.photos/80'
                    }
                    size={'lg'}
                    alt={'Creator'}
                    css={{
                        border: '4px solid white',
                    }}
                />
            </Flex>
            <Box p={6}>
                <Stack spacing={2} align={'center'} mb={5}>
                    <Heading fontSize={'xl'} fontWeight={500} fontFamily={'body'}>
                        <NextLink href={`/user/${address}`} passHref><Link color={'blue.500'}>{name ? name : "Your Name"}</Link></NextLink>
                    </Heading>
                    <Text textAlign={'center'}>{bio ? bio : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</Text>
                    <HStack gap={12} fontSize={'2xl'}>
                        <Link href={facebook ? facebook : "#"} color={'blue.500'}><FacebookIcon /></Link>
                        <Link href={instagram ? instagram : "#"} color={'pink.400'}><InstagramIcon /></Link>
                        <Link href={twitter ? twitter : "#"} color={'blue.500'}><TwitterIcon /></Link>
                        <Link href={website ? website : "#"} color={'pink.400'}><ExternalLinkIcon /></Link>
                    </HStack>
                </Stack>
            </Box>
        </Box>
    );
}