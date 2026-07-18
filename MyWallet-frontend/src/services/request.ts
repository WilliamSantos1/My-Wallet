import { api } from "./api";

export async function request<TResponse, TBody = unknown>(
    method: "get" | "post" | "put" | "patch" | "delete",
    endpoint: string,
    body?: TBody
): Promise<TResponse> {
    const response = await api.request<TResponse>({
        method,
        url: endpoint,
        data: body,
    });

    return response.data;
}