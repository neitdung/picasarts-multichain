import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload({ setMedia, triggerState }) {
    const onDrop = useCallback(acceptedFiles => {
        let file = acceptedFiles[0];
        setMedia(file);
        triggerState(true);
    }, [])
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        maxFiles: 1,
        maxSize: 10000000,
        onDrop
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop image here, or click to select image</p>
            </div>
        </section>
    );
}