import { api } from "./api";

interface PostData<T> {
    endpoint: string;
    body: T;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export default async function postData<T>({
    endpoint,
    body,
    onSuccess,
    onError,
}: PostData<T>) {
    try {
        const response = await api.post(endpoint, body);

        onSuccess?.(response.data);

        return response.data;
    } catch (error) {
        console.error(error);
        onError?.(error);

        throw error;
    }
}