import { getStorage, getDownloadURL, ref, uploadBytesResumable, deleteObject, UploadMetadata, UploadTask } from "@firebase/storage";

export const tcv_FirebaseStorage = {
    uploadFile: (fileName: string, file: Blob, metadata: UploadMetadata): UploadTask => {
        const storage = getStorage();
        const storageRef = ref(storage, fileName);
        return uploadBytesResumable(storageRef, file, metadata);
    },
    getURL: (fileName: string): Promise<string> => {
        const storage = getStorage();
        const storageRef = ref(storage, fileName);
        return getDownloadURL(storageRef);
    },
    deleteFile: (fileName: string): Promise<void> => {
        const storage = getStorage();
        const storageRef = ref(storage, fileName);
        return deleteObject(storageRef);
    },
};
