/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderItem } from './OrderItem';
import type { QuestionSolutionCollect } from './QuestionSolutionCollect';

export type Page_QuestionSolutionCollect_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<QuestionSolutionCollect>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
