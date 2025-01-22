import { ipfsClient } from "./config";

export const uploadToIPFS = async (file) => {
    try {
      const added = await ipfsClient.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload image');
    }
  };