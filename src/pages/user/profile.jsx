import React, { useEffect, useState } from 'react';
import { Formik, Field } from "formik";
import {
    Box,
    Button,
    Grid,
    GridItem,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Flex,
    Text,
    Center,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NotConnected from 'src/components/common/NotConnected';
import ImageUpload from 'src/components/common/ImageUpload';
import UserCard from 'src/components/user/Card';
import { useDispatch, useSelector } from 'react-redux';
import getProfile from 'src/state/profile/thunks/getProfile';
import { uploadBtfs } from 'src/state/util';
import { setIsConnecting } from 'src/state/profile/slice';
import { useRouter } from 'next/router';
import checkArtist from 'src/state/profile/thunks/checkArtist';
import loadContract from 'src/state/hub/thunks/loadContract';
export default function Settings() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loaded } = useSelector(state => state.hub);
    const account = useSelector(state => state.chain.account);
    const profile = useSelector(state => state.profile);
    const selectedChain = useSelector(state => state.chain.selectedChain);

    const [avatar, setAvatar] = useState('');
    const [banner, setBanner] = useState('');
    const [editAvatar, setEditAvatar] = useState(false);
    const [editBanner, setEditBanner] = useState(false);

    const toast = useToast();

    const submitUser = async (values) => {
        let [uploadedAvatar, uploadedBanner] = await Promise.all([
            editAvatar ? uploadBtfs(avatar) : () => { },
            editBanner ? uploadBtfs(banner) : () => { }
        ]);

        if (editAvatar) {
            values.avatar = uploadedAvatar;
        }
        if (editBanner) {
            values.banner = uploadedBanner;
        }
        setEditAvatar(false);
        setEditBanner(false);
        if (profile.data.isRegistered) {
            await editUser(values);
        } else {
            await registerUser(values);
        }
        router.reload();
    }

    const registerArtist = async (e) => {
        e.preventDefault();
        dispatch(setIsConnecting(true))
        let res = await fetch("/api/artist/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chain: selectedChain, address: account })
        });
        let resJson = await res.json();
        if (resJson.error) {
            toast({
                title: "Register Artist failed: " + resJson.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Register Artist success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        dispatch(setIsConnecting(false))
    }

    const registerUser = async (values) => {
        dispatch(setIsConnecting(true))
        let [uploadedAvatar, uploadedBanner] = await Promise.all([
            editAvatar ? uploadBtfs(avatar) : () => { },
            editBanner ? uploadBtfs(banner) : () => { }
        ]);

        if (editAvatar) {
            values.avatar = uploadedAvatar;
        }
        if (editBanner) {
            values.banner = uploadedBanner;
        }

        let res = await fetch("/api/user/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
    
        if (res.status !== 200) {
            toast({
                title: "Register failed",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Register success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        dispatch(setIsConnecting(false))
    }

    const editUser = async (values) => {
        dispatch(setIsConnecting(true))
        let [uploadedAvatar, uploadedBanner] = await Promise.all([
            editAvatar ? uploadBtfs(avatar) : () => { },
            editBanner ? uploadBtfs(banner) : () => { }
        ]);
        if (editAvatar) {
            values.avatar = uploadedAvatar;
        }
        if (editBanner) {
            values.banner = uploadedBanner;
        }
        let res = await fetch("/api/user/edit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        if (res.status !== 200) {
            toast({
                title: "Edit failed",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Edit success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        dispatch(setIsConnecting(false))
    }

    useEffect(() => {
        if (profile.data.loaded) {
            setAvatar(profile.data.avatar);
            setBanner(profile.data.banner);
        } else {
            dispatch(getProfile())
        }
    }, [profile, account]);

    useEffect(() => {
        if (loaded) {
            dispatch(checkArtist())
        } else {
            dispatch(loadContract())
        }
    }, [loaded])
    if (!account || !profile.data.loaded) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>MY PROFILE</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                <Box bg="white" p={6} borderRadius={10} >
                    <Formik
                        onSubmit={submitUser}
                        initialValues={{ address: account, ...profile.data }}
                        validate={values => {
                            const errors = {};
                            if (!values.name) {
                                errors.name = 'Required';
                            }
                            return errors;
                        }}
                    >
                        {({ handleSubmit, errors }) => (
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4} align="flex-start">
                                    <Flex w={'100%'} gap={12} justify={'space-between'}>
                                        <FormControl>
                                            <FormLabel htmlFor="address">Address</FormLabel>
                                            <Field
                                                as={Input}
                                                id="address"
                                                name="address"
                                                disabled={true}
                                            />
                                        </FormControl>
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
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <Field
                                                as={Input}
                                                id="email"
                                                name="email"
                                            />
                                        </FormControl>
                                    </Flex>
                                    <Flex w={'100%'} gap={12} justify={'space-between'}>
                                        <FormControl>
                                            <FormLabel htmlFor="avatar">Avatar</FormLabel>
                                            <Box borderColor={'pink.400'} borderWidth={5} p={5} borderRadius={10} borderStyle={'dashed'}>
                                                <ImageUpload setMedia={setAvatar} triggerState={setEditAvatar} />
                                            </Box>
                                            <Field
                                                as={Input}
                                                id="avatar"
                                                name="avatar"
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
                                                disabled={true}
                                                hidden
                                            />
                                        </FormControl>
                                    </Flex>
                                    <FormControl>
                                        <FormLabel htmlFor="bio">Bio</FormLabel>
                                        <Field
                                            as={Textarea}
                                            id="bio"
                                            name="bio"
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
                                    <Flex w={'100%'} gap={12} justify={'start'}>
                                        <Button type="submit"
                                            color={'white'}
                                            bgColor='#f5505e'
                                            w={'50%'}
                                            _hover={{
                                                bg: 'pink.300',
                                            }}
                                            isLoading={!profile.data.loaded || profile.isConnecting}
                                        >
                                            {profile.data.isRegistered ? "Update" : "Register"}
                                        </Button>
                                        {(profile.isArtist !== 2) && <Button
                                            onClick={registerArtist}
                                            color={'white'}
                                            bgColor='#ef1399'
                                            w={'50%'}
                                            isDisabled={profile.isArtist === 1}
                                            isLoading={!profile.data.loaded || profile.isConnecting}
                                        >
                                            Register as Artist
                                        </Button>}
                                    </Flex>
                                </VStack>
                            </form>
                        )}
                    </Formik>
                </Box>
            </GridItem>
            <GridItem>
                <UserCard
                    avatar={avatar}
                    banner={banner}
                    editAvatar={editAvatar}
                    editBanner={editBanner}
                    name={profile.data.name}
                    bio={profile.data.bio}
                />
            </GridItem>
        </Grid>
    );
}