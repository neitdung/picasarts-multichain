import React from 'react';
import {
    Heading,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Link,
    HStack,
    Button
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NextLink from 'next/link';

export default function CollectionCard({ cid, name, description, logo, banner, facebook, twitter, instagram, website, editLogo, editBanner, canEdit }) {
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
                    editBanner ? URL.createObjectURL(banner) : banner ? `http://127.0.0.1:8080/btfs/${banner}` : 'https://picsum.photos/500/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-8}>
                <Image
                    src={
                        editLogo ? URL.createObjectURL(logo) : logo ? `http://127.0.0.1:8080/btfs/${logo}` : 'https://picsum.photos/80'
                    }
                    h={'60px'}
                    w={'60px'}
                    alt={'Creator'}
                    css={{
                        border: '4px solid white',
                        borderRadius: '100px'
                    }}
                />
            </Flex>
            <Box p={6}>
                <Stack spacing={2} align={'center'} mb={5}>
                    <Heading fontSize={'xl'} fontWeight={500} fontFamily={'body'}>
                        <NextLink href={`/collection/${cid?.toString()}`} passHref><Link color={'blue.500'}>{name ? name : "Collection Name"}</Link></NextLink>
                    </Heading>
                    <Text textAlign={'center'}>{description ? description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</Text>
                    <HStack gap={12} fontSize={'2xl'}>
                        <Link href={facebook ? facebook : "#"} color={'blue.500'}><FacebookIcon /></Link>
                        <Link href={instagram ? instagram : "#"} color={'pink.400'}><InstagramIcon /></Link>
                        <Link href={twitter ? twitter : "#"} color={'blue.500'}><TwitterIcon /></Link>
                        <Link href={website ? website : "#"} color={'pink.400'}><ExternalLinkIcon /></Link>
                    </HStack>
                </Stack>
                {(canEdit) && <Flex w={'full'} gap={2}><NextLink href={`/collection/edit/${cid.toString()}`} passHref><Link w={'full'}><Button w={'full'}>Edit Metadata</Button></Link></NextLink></Flex>}
            </Box>
        </Box>
    );
}