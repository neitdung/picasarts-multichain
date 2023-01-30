import React from 'react';
import { Formik, Field } from "formik";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Flex,
    Text,
    Textarea,
} from "@chakra-ui/react";
import ImageUpload from 'src/components/common/ImageUpload';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';

export default function CollectionForm({isArtist, isLoading, values, onSubmit, logo, banner, setEditLogo, setEditBanner, setLogo, setBanner, isUploaded }) {
    return (
        <Box bg="white" p={6} borderRadius={10} >
            <Formik
                initialValues={values}
                onSubmit={onSubmit}
                validate={values => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = 'Required';
                    }
                    if (!values.symbol) {
                        errors.symbol = 'Required';
                    }
                    return errors;
                }}
            >
                {({ handleSubmit, errors }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="flex-start">
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl isInvalid={!!errors.name}>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Field
                                        disabled={isUploaded}
                                        as={Input}
                                        id="name"
                                        name="name"
                                    />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.symbol}>
                                    <FormLabel htmlFor="symbol">Symbol</FormLabel>
                                    <Field
                                        disabled={isUploaded}
                                        as={Input}
                                        id="symbol"
                                        name="symbol"
                                    />
                                    <FormErrorMessage>{errors.symbol}</FormErrorMessage>
                                </FormControl>
                            </Flex>
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl>
                                    <FormLabel htmlFor="logo">Logo</FormLabel>
                                    <Box borderColor={'pink.400'} borderWidth={5} p={5} borderRadius={10} borderStyle={'dashed'}>
                                        <ImageUpload setMedia={setLogo} triggerState={setEditLogo} />
                                    </Box>
                                    <Field
                                        as={Input}
                                        id="logo"
                                        name="logo"
                                        value={logo}
                                        disabled={true}
                                        hidden
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="banner">Banner</FormLabel>
                                    <Box borderColor={'pink.400'} borderWidth={5} p={5} borderRadius={10} borderStyle={'dashed'}>
                                        <ImageUpload setMedia={setBanner} triggerState={setEditBanner} />
                                    </Box>
                                    <Field
                                        as={Input}
                                        id="banner"
                                        name="banner"
                                        value={banner}
                                        disabled={true}
                                        hidden
                                    />
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <Field
                                    as={Textarea}
                                    id="description"
                                    name="description"
                                />
                            </FormControl>
                            <Text>Social Link</Text>
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<FacebookIcon color='blue.500' />}
                                        />
                                        <Field
                                            as={Input}
                                            id="facebook"
                                            name="facebook"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<InstagramIcon color='pink.400' />}
                                        />
                                        <Field
                                            as={Input}
                                            id="instagram"
                                            name="instagram"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<TwitterIcon color='blue.500' />}
                                        />
                                        <Field
                                            as={Input}
                                            id="twitter"
                                            name="twitter"
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <InputGroup>
                                    <InputRightElement
                                        pointerEvents='none'
                                        children={<ExternalLinkIcon color='pink.400' />}
                                    />
                                    <Field
                                        as={Input}
                                        id="website"
                                        name="website"
                                    />
                                </InputGroup>
                            </FormControl>
                            <Flex w={'full'} gap={12} justify={'center'}>
                                <Button type="submit"
                                    colorScheme='pink'
                                    isLoading={isLoading}
                                    isDisabled={isArtist !== 2}
                                    w={'50%'}
                                >
                                    {values.name ? "Update" : "Create"}
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                )}
            </Formik>
        </Box>
    );
}