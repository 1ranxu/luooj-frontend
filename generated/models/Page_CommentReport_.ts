/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommentReport } from './CommentReport';
import type { OrderItem } from './OrderItem';

export type Page_CommentReport_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<CommentReport>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
