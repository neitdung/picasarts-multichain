import React from 'react';
import {
    Box,
    SkeletonCircle,
    SkeletonText
} from "@chakra-ui/react";

export default function BoxLoading() {
    return (
        <Box padding='6' w='full' boxShadow='lg' bg='white'>
            <SkeletonCircle size='10' />
            <SkeletonText mt='4' noOfLines={4} spacing='4' />
        </Box>
    );
}