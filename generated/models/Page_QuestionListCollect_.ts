/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderItem } from './OrderItem';
import type { QuestionListCollect } from './QuestionListCollect';

export type Page_QuestionListCollect_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<QuestionListCollect>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
