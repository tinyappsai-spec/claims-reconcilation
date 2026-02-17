import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "./apiClient";
import { SummaryStats } from "../types";

export interface UploadResponse {
    summary?: SummaryStats;
    total_records?: number;
    reconciliation?: any[];
}

export interface PaginatedReconciliationResponse {
    data: any[];
    total: number;
    skip: number;
    limit: number;
}

export const useUploadClaims = () => {
    return useMutation({
        mutationKey: ["uploadClaims"],
        mutationFn: async (formData: FormData) => {
            const { data } = await apiClient.post<UploadResponse>("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        },
    });
};

export const useInfiniteReconciliation = () => {
    return useInfiniteQuery({
        queryKey: ["reconciliation"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 50;
            const { data } = await apiClient.get<PaginatedReconciliationResponse>("/reconciliation", {
                params: { skip: pageParam, limit },
            });
            return data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const nextSkip = lastPage.skip + lastPage.limit;
            return nextSkip < lastPage.total ? nextSkip : undefined;
        },
    });
};
