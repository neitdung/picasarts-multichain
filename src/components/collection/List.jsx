import React, { useContext, useEffect, useState } from 'react';
import {
    SimpleGrid
} from "@chakra-ui/react";
import { appStore } from 'src/state/app';
import CollectionCard from './Card';

export default function CollectionList({ address, limit }) {
    const { state } = useContext(appStore);
    const { collectionContract, wallet: { signer: { _address } }, mounted } = state;
    const [list, setList] = useState([]);
    const canEdit = address == _address;
    const loadCollections = async () => {
        let listCollections = [];
        if (address) {
            listCollections = await collectionContract.obj.getCollectionsByOwner(address);
        } else {
            listCollections = await collectionContract.obj.getAllCollections();
        }
        if (limit) {
            listCollections = listCollections.slice(-limit);
        }
        const metaFetch = [];
        listCollections.forEach(item => {
            metaFetch.push(fetch(`http://127.0.0.1:8080/btfs/${item.metadata}`, { headers: { "content-type": "application/json" } }));
        });
        let values = await Promise.all(metaFetch);
        let newPromises = values.map(item => item.json());
        let metaRes = await Promise.all(newPromises);
        setList(metaRes.map((item, index) => ({ ...item, ...listCollections[index] })));
    }

    useEffect(() => {
        if (mounted && collectionContract.loaded && _address) {
            loadCollections();
        }
    }, [mounted, collectionContract, _address]);

    return (
        <SimpleGrid columns={3} gap={4} justifyItems='center'>
            {list.map(item =>
                <CollectionCard {...item} canEdit={canEdit} />
            )}
        </SimpleGrid>
    );
}