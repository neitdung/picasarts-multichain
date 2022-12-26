import React, { useState, useContext, useEffect } from "react";
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
import { appStore, getTokens } from "src/state/app";
import LoanList from "src/components/loan/List";
const sortByActions = [
    { label: "Newest" },
    { label: "Latest" },
    { label: "Name A to Z" },
    { label: "Name A to Z" },
    { label: "ROS low to high" },
    { label: "ROS high to low" }
];

export default function Loan() {
    const { state, dispatch } = useContext(appStore);
    const [sortBy, setSortBy] = useState(0);
    const {
        mounted,
        wallet: {signer: {_address}},
        tokens
    } = state;

    // useEffect(() => {
    //     if (mounted && _address) {
    //         dispatch(getTokens());
    //     }
    // }, [mounted, _address])

    return (
        <Box w={'full'} px={20} py={2}>
            <Box p={10}>
                <Center><Text fontSize={'2xl'} fontWeight={'bold'}>Loan Covenants</Text></Center>
            </Box>
            <Flex w={'full'} justify={'space-between'}>
                <Text fontWeight={'bold'}>Filter</Text>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
                <Accordion allowMultiple allowToggle borderWidth={1} w={'xs'} h={'min'}>
                    <AccordionItem fontSize='md'>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left' >
                                    Status
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel py={2} bg={'gray.100'}>
                            <CheckboxGroup colorScheme='pink'>
                                <Stack spacing={[1, 2]}>
                                    <Checkbox value='listing'>Listing</Checkbox>
                                    <Checkbox value='locked'>Locked</Checkbox>
                                    <Checkbox value='ended'>Ended</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem fontSize='md'>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left' >
                                    ROS
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel py={2} bg={'gray.100'} px={4}>
                            <RangeSlider aria-label={['min', 'max']} min={0} max={100} defaultValue={[0, 100]}>
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
                                    Token
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel py={2} bg={'gray.100'}>
                            <CheckboxGroup colorScheme='pink'>
                                <Stack spacing={[1, 2]}>
                                    {(tokens.length) && tokens.map(item => 
                                        <Checkbox value={item.tokenId}>{item.tokenAbbr}</Checkbox>
                                        )}
                                </Stack>
                            </CheckboxGroup>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <LoanList columns={4}/>
            </Flex>
        </Box>
    );
}