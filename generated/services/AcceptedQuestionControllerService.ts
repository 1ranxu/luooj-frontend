/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_AcceptedQuestionDetailVO_ } from '../models/BaseResponse_AcceptedQuestionDetailVO_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcceptedQuestionControllerService {

    /**
     * getAcceptedQuestionDetail
     * @returns BaseResponse_AcceptedQuestionDetailVO_ OK
     * @throws ApiError
     */
    public static getAcceptedQuestionDetailUsingGet(): CancelablePromise<BaseResponse_AcceptedQuestionDetailVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/accepted_question/get/user_accepted_question/detail',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getAcceptedQuestionRanking
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getAcceptedQuestionRankingUsingGet(): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/accepted_question/get/user_accepted_question/ranking',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * isAccepted
     * @param questionId questionId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isAcceptedUsingGet(
questionId: number,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/accepted_question/isAccepted',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
