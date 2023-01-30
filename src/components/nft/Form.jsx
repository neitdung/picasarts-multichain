import React from 'react';
import { Formik, Field, FieldArray } from "formik";
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
    HStack,
    Flex,
    Text,
    Textarea,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from "@chakra-ui/react";
import ImageUpload from 'src/components/common/ImageUpload';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { SketchPicker } from 'react-color'

export default function NFTForm({isLoading, initialValues, onSubmit, collections, setImage, setEditImage, setBg, bg }) {
    return (
        <Box bg="white" p={6} borderRadius={10} >
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={values => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = 'Required';
                    }
                    if (values.royalty > 20 || values.royalty <0) {
                        errors.royalty = 'Royalty value is not accepted';
                    }
                    return errors;
                }}
            >
                {({ values, handleSubmit, errors }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="flex-start">
                            <FormControl>
                                <FormLabel htmlFor="contract_address">Collection</FormLabel>
                                <Field
                                    as={Select}
                                    id="contract_address"
                                    name="contract_address">
                                    {(collections.length) && collections.map(item => <option key={item.contractAddress} value={item.contractAddress}>{item.contractAddress} - {item.symbol} - {item.name}</option>)}
                                </Field>
                            </FormControl>
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl isInvalid={!!errors.name}>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Field
                                        as={Input}
                                        id="name"
                                        name="name"
                                    />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="name">External URL</FormLabel>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<ExternalLinkIcon color='pink.400' />}
                                        />
                                        <Field
                                            as={Input}
                                            id="external_url"
                                            name="external_url"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={!!errors.royalty}>
                                    <FormLabel htmlFor="royalty">Royalty</FormLabel>
                                    <NumberInput
                                        defaultValue={0}
                                        min={0}
                                        max={20}
                                        keepWithinRange={false}
                                        clampValueOnBlur={false}
                                    >
                                        <Field
                                            as={NumberInputField}
                                            id="royalty"
                                            name="royalty"
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <FormErrorMessage>{errors.royalty}</FormErrorMessage>
                                </FormControl>
                            </Flex>
                            <Flex w={'full'} gap={12} justify={'space-between'}>
                                <FormControl>
                                    <FormLabel htmlFor="description">Description</FormLabel>
                                    <Field
                                        as={Textarea}
                                        id="description"
                                        name="description"
                                    />
                                </FormControl>
                            </Flex>
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl>
                                    <FormLabel htmlFor="image">Image</FormLabel>
                                    <Box borderColor={'pink.400'} borderWidth={5} py={20} px={5} borderRadius={10} borderStyle={'dashed'} h={300}>
                                        <ImageUpload setMedia={setImage} triggerState={setEditImage} />
                                    </Box>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Background Color</FormLabel>
                                    <SketchPicker color={bg} onChangeComplete={(color) => setBg(color.hex)} />
                                </FormControl>
                            </Flex>
                            <Text>Attributes</Text>
                            <FieldArray name="attributes" w={'full'}>
                                {({ push, remove }) => (
                                    <VStack w={'full'}>
                                        {values.attributes.length > 0 && <HStack w='96%' pl={2}>
                                            <FormControl w='full'><FormLabel>Display</FormLabel></FormControl>
                                            <FormControl w='full'><FormLabel>Trait</FormLabel></FormControl>
                                            <FormControl w='full'><FormLabel>Value</FormLabel></FormControl>
                                        </HStack>}
                                        {values.attributes.map((attribute, index) => (
                                            <HStack key={index} w='full'>
                                                <FormControl>
                                                    <Field
                                                        as={Select}
                                                        name={`attributes[${index}].display_type`}
                                                    >
                                                            <option value='string'>String</option>
                                                            <option value='number'>Number</option>
                                                            <option value='date'>Date</option>
                                                            <option value='boost_number'>Boost Number</option>
                                                            <option value='boost_percentage'>Boost Percentage</option>
                                                    </Field>
                                                </FormControl>
                                                <FormControl>
                                                    <Field
                                                        as={Input}
                                                        name={`attributes[${index}].trait_type`}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <Field
                                                        as={Input}
                                                        name={`attributes[${index}].value`}
                                                    />
                                                </FormControl>

                                                <Button type="button" onClick={() => remove(index)}>
                                                    -
                                                </Button>
                                            </HStack>
                                        ))}
                                        <Button
                                            type="button"
                                            w={'full'}
                                            onClick={() => push({ display_type: '', trait_type: '', value: '' })}
                                        >
                                            +
                                        </Button>
                                    </VStack>
                                )}
                            </FieldArray>
                            <Flex w={'full'} gap={12} justify={'center'}>
                                <Button type="submit"
                                    color={'white'}
                                    bgColor='#f5505e'
                                    w={'50%'}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}
                                    disabled={isLoading}
                                >
                                    Create
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                )}
            </Formik>
        </Box>
    );
}