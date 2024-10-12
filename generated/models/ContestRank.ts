/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContestRankQuestionDetail } from './ContestRankQuestionDetail';
import type { Pair_string_int_ } from './Pair_string_int_';
import type { UserVO } from './UserVO';

export type ContestRank = {
    score?: number;
    submitDetail?: Record<string, ContestRankQuestionDetail>;
    time?: Pair_string_int_;
    userVO?: UserVO;
};
