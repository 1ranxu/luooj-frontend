/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderItem } from './OrderItem';
import type { QuestionSolutionComment } from './QuestionSolutionComment';

export type Page_QuestionSolutionComment_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<QuestionSolutionComment>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
