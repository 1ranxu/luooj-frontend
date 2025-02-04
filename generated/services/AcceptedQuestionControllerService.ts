/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptedQuestionQueryRequest } from '../models/AcceptedQuestionQueryRequest';
import type { BaseResponse_AcceptedQuestionDetailVO_ } from '../models/BaseResponse_AcceptedQuestionDetailVO_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_AcceptedQuestion_ } from '../models/BaseResponse_Page_AcceptedQuestion_';
import type { DeleteRequest } from '../models/DeleteRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcceptedQuestionControllerService {

    /**
     * deleteAcceptedQuestion
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteAcceptedQuestionUsingPost(
deleteRequest: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/accepted_question/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getAcceptedQuestionDetail
     * @param userId userId
     * @returns BaseResponse_AcceptedQuestionDetailVO_ OK
     * @throws ApiError
     */
    public static getAcceptedQuestionDetailUsingGet(
userId: number,
): CancelablePromise<BaseResponse_AcceptedQuestionDetailVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/accepted_question/get/user_accepted_question/detail',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getAcceptedQuestionRanking
     * @param userId userId
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getAcceptedQuestionRankingUsingGet(userId: number,): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/accepted_question/get/user_accepted_question/ranking',
            query: {
                'userId': userId,
            },
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

    /**
     * listAcceptedQuestionByPage
     * @param acceptedQuestionQueryRequest acceptedQuestionQueryRequest
     * @returns BaseResponse_Page_AcceptedQuestion_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listAcceptedQuestionByPageUsingPost(
acceptedQuestionQueryRequest: AcceptedQuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_AcceptedQuestion_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/accepted_question/list/page',
            body: acceptedQuestionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
