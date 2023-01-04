import React, { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import favicon from "src/public/static/favicon.ico";
const clientSideEmotionCache = createEmotionCache();
import AppBar from 'src/components/layout/AppBar';
import Footer from 'src/components/layout/Footer';
import theme from 'src/styles/theme';
import { Box, SkeletonCircle, SkeletonText, ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/state/store';
import { PersistGate } from 'redux-persist/integration/react';
import NotInstall from 'src/components/common/NotInstall';

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const Router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => setIsLoading(true))
        Router.events.on('routeChangeComplete', () => setIsLoading(false))
    }, [Router])

    const actualPageMarkup = (
        <Component {...pageProps} />
    );

    const loadingPageMarkup = (
        <Box my='6' w='full' boxShadow='lg' bg='white' p={20}>
            <Box>
                <SkeletonCircle size='20' />
                <SkeletonText mt='4' noOfLines={12} spacing='4' />
            </Box>
        </Box>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link rel="shortcut icon" href={favicon.src} />
                <meta name={"title"} title={"Picasarts"} />
                <title>Picasarts</title>
            </Head>
            <ChakraProvider theme={theme}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <AppBar />
                        {pageMarkup}
                        <Footer />
                    </PersistGate>
                </Provider>
            </ChakraProvider>
        </CacheProvider>
    );
}