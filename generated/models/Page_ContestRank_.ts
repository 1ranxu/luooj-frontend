/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContestRank } from './ContestRank';
import type { OrderItem } from './OrderItem';

export type Page_ContestRank_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<ContestRank>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
