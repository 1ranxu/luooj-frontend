/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionJudgeCconfig } from './QuestionJudgeCconfig';
import type { UserVO } from './UserVO';

export type QuestionVO = {
    acceptedNum?: number;
    answer?: string;
    comments?: number;
    content?: string;
    createTime?: string;
    difficulty?: number;
    id?: number;
    isAccepted?: number;
    judgeConfig?: QuestionJudgeCconfig;
    likes?: number;
    submitNum?: number;
    tags?: Array<string>;
    title?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
};
