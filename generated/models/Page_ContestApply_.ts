/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContestApply } from './ContestApply';
import type { OrderItem } from './OrderItem';

export type Page_ContestApply_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<ContestApply>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
