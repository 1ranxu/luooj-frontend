/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcceptedQuestion } from './AcceptedQuestion';
import type { OrderItem } from './OrderItem';

export type Page_AcceptedQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<AcceptedQuestion>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
