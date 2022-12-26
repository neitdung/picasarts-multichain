import React from "react";
import { Box, Text, Center } from "@chakra-ui/react";
import CollectionList from "src/components/collection/List";

export default function Collections() {
    return (

        <Box px={{ base: 4, md: 20 }} py={{ base: 4, md: 20 }}>
            <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)' pb={10}
                bgClip='text'>ALL COLLECTIONS</Text></Center>
            <CollectionList />
        </Box>

    );
}