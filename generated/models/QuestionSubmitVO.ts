/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionSubmitJudgeInfo } from './QuestionSubmitJudgeInfo';
import type { QuestionVO } from './QuestionVO';
import type { UserVO } from './UserVO';

export type QuestionSubmitVO = {
    code?: string;
    createTime?: string;
    id?: number;
    judgeInfo?: QuestionSubmitJudgeInfo;
    language?: string;
    questionId?: number;
    questionVO?: QuestionVO;
    status?: number;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
};
