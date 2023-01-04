import { Box } from "@chakra-ui/react";
import Banner from "src/components/home/Banner";

export default function Index() {
    return (
        <Box px={{ base: 4, md: 20 }}>
            <Banner />
        </Box>
    )
}