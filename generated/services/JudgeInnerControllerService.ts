/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContestQuestionSubmit } from '../models/ContestQuestionSubmit';
import type { ExecuteCodeRequest } from '../models/ExecuteCodeRequest';
import type { ExecuteCodeResponse } from '../models/ExecuteCodeResponse';
import type { QuestionSubmitJudgeInfo } from '../models/QuestionSubmitJudgeInfo';
import type { QuestionSubmitVO } from '../models/QuestionSubmitVO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JudgeInnerControllerService {

    /**
     * commonJudge
     * @param questionSubmitId questionSubmitId
     * @returns QuestionSubmitVO OK
     * @returns any Created
     * @throws ApiError
     */
    public static commonJudgeUsingPost(
questionSubmitId: number,
): CancelablePromise<QuestionSubmitVO | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/judge/inner/common',
            query: {
                'questionSubmitId': questionSubmitId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * contestJudge
     * @param contestQuestionSubmit contestQuestionSubmit
     * @returns QuestionSubmitJudgeInfo OK
     * @returns any Created
     * @throws ApiError
     */
    public static contestJudgeUsingPost(
contestQuestionSubmit: ContestQuestionSubmit,
): CancelablePromise<QuestionSubmitJudgeInfo | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/judge/inner/contest',
            body: contestQuestionSubmit,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * runOnline
     * @param executeCodeRequest executeCodeRequest
     * @returns ExecuteCodeResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static runOnlineUsingPost(
executeCodeRequest: ExecuteCodeRequest,
): CancelablePromise<ExecuteCodeResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/judge/inner/run',
            body: executeCodeRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
