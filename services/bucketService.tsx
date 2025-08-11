import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"


export const uploadAudio = async (userId: string, recordingUri: string, recName: string) => {

    const storageRef = ref(storage, `${userId}/recordings/${recName}`);

    const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.response);
        }

        xhr.onerror = () => {
            reject(new Error("Failed to convert audio to blob"))
        }

        xhr.responseType = "blob";
        xhr.open("GET", recordingUri, true);
        xhr.send(null);
    })

    const uploadResult = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
}

export const downloadAudio = async (url: string) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
        const blob = xhr.response;
    };
    xhr.open("GET", url);
    xhr.send();
}

export const deleteAudio = async (userId: string, recName: string) => {
    const storageRef = ref(storage, `${userId}/recordings/${recName}`);
    
    deleteObject(storageRef) .then(() => {
        console.log("File deleted successfully");
    }).catch((error) => {
        console.log("Error ", error);
    });
}

//TODO: List all function?