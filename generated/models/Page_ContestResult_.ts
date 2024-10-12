/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContestResult } from './ContestResult';
import type { OrderItem } from './OrderItem';

export type Page_ContestResult_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<ContestResult>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
