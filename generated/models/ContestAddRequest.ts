/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContestQuestion } from './ContestQuestion';

export type ContestAddRequest = {
    award?: string;
    duration?: number;
    endTime?: string;
    questions?: Record<string, ContestQuestion>;
    startTime?: string;
    status?: number;
    tips?: string;
    title?: string;
};
