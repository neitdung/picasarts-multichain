import React, { useState } from "react";
import {
    Box,
    Flex,
    Stack,
    Button,
    CheckboxGroup,
    Checkbox,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Text,
    Center,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from "@chakra-ui/icons";
import MarketList from "src/components/market/List";
const sortByActions = [
    { label: "Newest" },
    { label: "Latest" },
    { label: "Name A to Z" },
    { label: "Name A to Z" },
    { label: "Price low to high" },
    { label: "Price high to low" }
];

export default function Market() {
    const [sortBy, setSortBy] = useState(0);

    return (
        <Box w={'full'} px={20} py={2}>
            <Box p={10}>
                <Center><Text fontSize={'2xl'} fontWeight={'bold'}>Marketplace</Text></Center>
            </Box>
            <Flex w={'full'} justify={'space-between'}>
                <Text fontWeight={'bold'}>Filter</Text>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme='purple'>
                        Sort By: {sortByActions[sortBy].label}
                    </MenuButton>
                    <MenuList>
                        {sortByActions.map((item, index) =>
                            <MenuItem onClick={() => setSortBy(index)}>{item.label}</MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Flex>
            <Flex w={'full'} gap={10}>
                <Accordion allowMultiple allowToggle borderWidth={1} w={'xs'} h={'min'} colorScheme='red'>
                    <AccordionItem fontSize='md'>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left' >
                                    Type
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel py={2} bg={'gray.100'}>
                            <CheckboxGroup colorScheme='pink'>
                                <Stack spacing={[1, 2]}>
                                    <Checkbox value='purchase'>Purchase</Checkbox>
                                    <Checkbox value='auction'>Auction</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem fontSize='md'>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left' >
                                    Price
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel py={2} bg={'gray.100'}>
                            <RangeSlider aria-label={['min', 'max']} min={0} max={2000} defaultValue={[0, 2000]}>
                                <RangeSliderTrack bg='pink.200'>
                                    <RangeSliderFilledTrack bg='purple.500' />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                            </RangeSlider>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem fontSize='md'>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left' >
                                    Category
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel py={2} bg={'gray.100'}>
                            <CheckboxGroup colorScheme='pink'>
                                <Stack spacing={[1, 2]}>
                                    <Checkbox value='image'>Image</Checkbox>
                                    <Checkbox value='gif'>Gif</Checkbox>
                                    <Checkbox value='audio'>Audio</Checkbox>
                                    <Checkbox value='video'>Video</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <MarketList columns={3} />
            </Flex>
        </Box>
    );
}