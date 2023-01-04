import React from "react";
import {
    Container,
    Stack,
    Flex,
    Box,
    Heading,
    Text,
    Button,
    AspectRatio,
    Icon,
    IconButton,
    createIcon,
    useColorModeValue,
    Divider
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { RepeatClockIcon } from "@chakra-ui/icons";
import MarketBanner from "./MarketBanner";
import LoanBanner from "./LoanBanner";
import RentalBanner from "./RentalBanner";
export default function Banner() {
    return (
        <Container maxW={'7xl'}>
            <Stack
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}
                direction={{ base: 'column', md: 'row' }}>
                <Stack flex={1} spacing={{ base: 5, md: 10 }}>
                    <Heading
                        lineHeight={1.1}
                        fontWeight={600}
                        fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
                        <Text
                            as={'span'}
                            position={'relative'}
                            _after={{
                                content: "''",
                                width: 'full',
                                height: '30%',
                                position: 'absolute',
                                bottom: 1,
                                left: 0,
                                bg: 'red.400',
                                zIndex: -1,
                            }}>
                            All-in-one
                        </Text>
                        <br />
                        <Text as={'span'} color={'red.400'}>
                            Defi NFT platform
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        A convenient, secure and multi-chain platform to trade, rent,
                        take a loan and join loyalty programs with NFTs.
                        Try out for free!
                    </Text>
                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={{ base: 'column', sm: 'row' }}>
                        <NextLink href='/market' passHref>
                            <Button
                                rounded={'full'}
                                size={'lg'}
                                fontWeight={'normal'}
                                px={6}
                                colorScheme={'red'}
                                bg={'red.400'}
                                leftIcon={<MarketIcon color={'white'} />}
                                _hover={{ bg: 'red.500' }}>
                                Marketplace
                            </Button>
                        </NextLink>
                        <NextLink href='/loan' passHref>
                            <Button
                                rounded={'full'}
                                size={'lg'}
                                fontWeight={'normal'}
                                px={6}
                                colorScheme='blue'
                                leftIcon={<LoanIcon color={'gray.300'} />}>
                                Loan
                            </Button>
                        </NextLink>
                        <NextLink href='/rental' passHref>
                            <Button
                                rounded={'full'}
                                size={'lg'}
                                fontWeight={'normal'}
                                px={6}
                                colorScheme='teal'
                                leftIcon={<RepeatClockIcon/>}>
                                Rental
                            </Button>
                        </NextLink>
                    </Stack>
                </Stack>
                <Flex
                    flex={1}
                    justify={'center'}
                    align={'center'}
                    position={'relative'}
                    w={'full'}>
                    <Blob
                        w={'150%'}
                        h={'150%'}
                        position={'absolute'}
                        top={'-20%'}
                        left={0}
                        zIndex={-1}
                        color={useColorModeValue('red.50', 'red.400')}
                    />
                    <Box
                        position={'relative'}
                        height={'300px'}
                        rounded={'2xl'}
                        boxShadow={'2xl'}
                        width={'full'}
                        overflow={'hidden'}>
                        <IconButton
                            aria-label={'Play Button'}
                            variant={'ghost'}
                            _hover={{ bg: 'transparent' }}
                            icon={<PlayIcon w={12} h={12} />}
                            size={'lg'}
                            color={'white'}
                            position={'absolute'}
                            left={'50%'}
                            top={'50%'}
                            transform={'translateX(-50%) translateY(-50%)'}
                        />
                        <AspectRatio
                            alt={'Hero Image'}
                            fit={'cover'}
                            align={'center'}
                            w={'100%'}
                            h={'100%'}
                        ><iframe src="https://player.vimeo.com/video/741596237?h=f6ea733e9d" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen/></AspectRatio>
                    </Box>
                </Flex>
            </Stack>
            <Divider/>
            <MarketBanner />
            <Divider />
            <LoanBanner />
            <Divider />
            <RentalBanner />
        </Container>
    );
}

const PlayIcon = createIcon({
    displayName: 'PlayIcon',
    viewBox: '0 0 58 58',
    d:
        'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
});

const MarketIcon = createIcon({
    displayName: 'MarketIcon',
    viewBox: '0 0 24 24',
    d:
        'M24,10,21.8,0H2.2L.024,9.783,0,11a3.966,3.966,0,0,0,1,2.618V21a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V13.618A3.966,3.966,0,0,0,24,11ZM2,10.109,3.8,2H7V6H9V2h6V6h2V2h3.2L22,10.109V11a2,2,0,0,1-2,2H19a2,2,0,0,1-2-2H15a2,2,0,0,1-2,2H11a2,2,0,0,1-2-2H7a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2ZM20,22H4a1,1,0,0,1-1-1V14.858A3.939,3.939,0,0,0,4,15H5a3.975,3.975,0,0,0,3-1.382A3.975,3.975,0,0,0,11,15h2a3.99,3.99,0,0,0,3-1.357A3.99,3.99,0,0,0,19,15h1a3.939,3.939,0,0,0,1-.142V21A1,1,0,0,1,20,22Z',
});

const LoanIcon = createIcon({
    displayName: 'LoanIcon',
    viewBox: '0 0 24 24',
    d:
        'M16.5,0c-4.206,0-7.5,1.977-7.5,4.5v2.587c-.483-.057-.985-.087-1.5-.087C3.294,7,0,8.977,0,11.5v8c0,2.523,3.294,4.5,7.5,4.5,3.407,0,6.216-1.297,7.16-3.131,.598,.087,1.214,.131,1.84,.131,4.206,0,7.5-1.977,7.5-4.5V4.5c0-2.523-3.294-4.5-7.5-4.5Zm5.5,12.5c0,1.18-2.352,2.5-5.5,2.5-.512,0-1.014-.035-1.5-.103v-1.984c.49,.057,.992,.087,1.5,.087,2.194,0,4.14-.538,5.5-1.411v.911ZM2,14.589c1.36,.873,3.306,1.411,5.5,1.411s4.14-.538,5.5-1.411v.911c0,1.18-2.352,2.5-5.5,2.5s-5.5-1.32-5.5-2.5v-.911Zm20-6.089c0,1.18-2.352,2.5-5.5,2.5-.535,0-1.06-.038-1.566-.112-.193-.887-.8-1.684-1.706-2.323,.984,.28,2.092,.435,3.272,.435,2.194,0,4.14-.538,5.5-1.411v.911Zm-5.5-6.5c3.148,0,5.5,1.32,5.5,2.5s-2.352,2.5-5.5,2.5-5.5-1.32-5.5-2.5,2.352-2.5,5.5-2.5ZM7.5,9c3.148,0,5.5,1.32,5.5,2.5s-2.352,2.5-5.5,2.5-5.5-1.32-5.5-2.5,2.352-2.5,5.5-2.5Zm0,13c-3.148,0-5.5-1.32-5.5-2.5v-.911c1.36,.873,3.306,1.411,5.5,1.411s4.14-.538,5.5-1.411v.911c0,1.18-2.352,2.5-5.5,2.5Zm9-3c-.512,0-1.014-.035-1.5-.103v-1.984c.49,.057,.992,.087,1.5,.087,2.194,0,4.14-.538,5.5-1.411v.911c0,1.18-2.352,2.5-5.5,2.5Z',
});

export const Blob = (props) => {
    return (
        <Icon
            width={'100%'}
            viewBox="0 0 578 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
                fill="currentColor"
            />
        </Icon>
    );
};