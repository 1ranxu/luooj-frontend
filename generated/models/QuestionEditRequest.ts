/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionJudgeCase } from './QuestionJudgeCase';
import type { QuestionJudgeCconfig } from './QuestionJudgeCconfig';

export type QuestionEditRequest = {
    answer?: string;
    content?: string;
    id?: number;
    judgeCaseList?: Array<QuestionJudgeCase>;
    judgeConfig?: QuestionJudgeCconfig;
    tags?: Array<string>;
    title?: string;
};
