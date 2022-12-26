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
import { AppProvider } from 'src/state/app';
import NotInstall from 'src/components/common/NotInstall';

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const Router = useRouter();
    const skipToContentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const [windowObj, setWindowObj] = useState(null);
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive,
            ),
        [],
    );

    const toggleIsLoading = useCallback((path) => {
        setIsLoading((isLoading) => !isLoading)
        if (path === "/cp/add") {

        } else {
            Router.push(path);
        }

    }, []);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => setIsLoading(true))
        Router.events.on('routeChangeComplete', () => setIsLoading(false))
    }, [Router])

    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false);
            setWindowObj(window);
        }

    }, [isFirstLoading, windowObj])

    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
    );

    const actualPageMarkup = (
        <>
            {skipToContentTarget}
            {windowObj?.ethereum ? <Component {...pageProps} />
                : <NotInstall/>
            }
        </>
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
            <main>
                {windowObj &&
                    <ChakraProvider theme={theme}>
                        <AppProvider>
                            <AppBar
                                showMobileNavigation={mobileNavigationActive}
                                onNavigationDismiss={toggleMobileNavigationActive}
                                skipToContentTarget={skipToContentRef.current}
                            />
                            {pageMarkup}
                            <Footer />
                        </AppProvider>
                    </ChakraProvider>
                }
            </main>
        </CacheProvider>
    );
}