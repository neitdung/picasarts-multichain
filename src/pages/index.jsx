import Banner from "src/components/homepage/Banner";
import TopCollections from "src/components/homepage/TopCollections";
import {Box} from "@chakra-ui/react";
import TopNFTs from "../components/homepage/TopNFTs";
export default function Index() {
    return (
        <Box px={{ base: 4, md: 20 }}>
            <Banner />
            <TopCollections />
            <TopNFTs />
        </Box>
    )
}