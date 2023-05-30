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
    Button,
    VStack
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NextLink from 'next/link';

export default function CollectionCard({ cid, name, description, logo, banner, facebook, twitter, instagram, website, editLogo, editBanner, canEdit }) {
    return (
        <Flex
            maxW={500}
            w={'full'}
            bg={'white'}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
            direction='column'
            h='full'
            justifyContent='space-between'
            pb={4}
        >
            <Box>
                <Image
                    h={200}
                    w={'full'}
                    src={
                        editBanner ? URL.createObjectURL(banner) : banner ? `https://fs.picasarts.io/btfs/${banner}` : 'https://picsum.photos/500/200'
                    }
                    objectFit={'cover'}
                />
                <Flex justify={'center'} mt={-8}>
                    <Image
                        src={
                            editLogo ? URL.createObjectURL(logo) : logo ? `https://fs.picasarts.io/btfs/${logo}` : 'https://picsum.photos/80'
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
                <VStack h='max' p={6}>
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
                </VStack>
        </Box>
            {(canEdit) && <Button mx={6} colorScheme='purple' variant='outline'><Link as={NextLink} href={`/collection/edit/${cid.toString()}`} w={'full'}>Edit Metadata</Link></Button>}
        </Flex>
    );
}