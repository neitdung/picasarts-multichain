// export const uploadBtfs = async (file) => {
//     const formData = new FormData();
//     formData.append('File', file);
//     const options = {
//         method: 'POST',
//         body: formData
//     };
//     let result = await fetch("/api/upload", options);
//     let data = await result.json();
//     return data.Hash;
// }
export const uploadBtfs = async (file) => {
    const ipfsForm = new FormData();
    ipfsForm.append('media', file);
    const options = {
        method: 'POST',
        body: ipfsForm
    };
    let result = await fetch("/api/btfs/upload", options);
    let path = await result.text();
    return path;
}