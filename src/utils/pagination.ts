import type { Request } from 'express';

export interface PaginationParams {
    skip: number;
    take: number;
}

export interface PaginationMeta {
    total: number;
    skip: number;
    take: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export const getPagination = (
    query: Request['query'],
    defaultTake = 10
): PaginationParams => {
    const skip = Math.max(0, Number(query.skip ?? 0));
    const take = Math.min(100, Math.max(1, Number(query.take ?? defaultTake)));
    return { skip, take };
};

export const buildPaginationMeta = (
    total: number,
    params: PaginationParams
): PaginationMeta => ({
    total,
    skip: params.skip,
    take: params.take,
    hasNext: params.skip + params.take < total,
    hasPrev: params.skip > 0,
});
