import React, { useEffect, useMemo, useState } from 'react';
import {
    SimpleGrid
} from "@chakra-ui/react";
import CollectionCard from './Card';
import { useSelector } from 'react-redux';

export default function CollectionList({ address, limit }) {
    const { account, selectedChain } = useSelector(state => state.chain);
    const [list, setList] = useState([]);
    const canEdit = useMemo(() => address == account);
    const loadCollections = async () => {
        let listCollections = [];
        if (address) {
            let getReq = await fetch(`/api/collection/get-by-owner?chain=${selectedChain}&address=${address}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let getResJson = await getReq.json();
            if (!getResJson.error) {
                listCollections = getResJson.data;
            }
        } else {
            let getReq = await fetch(`/api/collection/get-all?chain=${selectedChain}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let getResJson = await getReq.json();
            if (!getResJson.error) {
                listCollections = getResJson.data;
            }
        }
        console.log(listCollections)
        if (limit && listCollections.length) {
            listCollections = listCollections.slice(-limit);
        }
        setList(listCollections);
    }

    useEffect(() => {
        loadCollections()
    }, [account]);

    return (
        <SimpleGrid columns={3} gap={4} justifyItems='center'>
            {list.map(item =>
                <CollectionCard {...item} canEdit={canEdit} />
            )}
        </SimpleGrid>
    );
}