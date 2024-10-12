/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionCollect_ } from '../models/BaseResponse_Page_QuestionCollect_';
import type { BaseResponse_QuestionCollect_ } from '../models/BaseResponse_QuestionCollect_';
import type { QuestionCollectAddRequest } from '../models/QuestionCollectAddRequest';
import type { QuestionCollectDeleteRequest } from '../models/QuestionCollectDeleteRequest';
import type { QuestionCollectQueryRequest } from '../models/QuestionCollectQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionCollectControllerService {

    /**
     * addQuestionCollect
     * @param questionCollectAddRequest questionCollectAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionCollectUsingPost(
questionCollectAddRequest: QuestionCollectAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_collect/add',
            body: questionCollectAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestionCollect
     * @param questionCollectDeleteRequest questionCollectDeleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionCollectUsingPost(
questionCollectDeleteRequest: QuestionCollectDeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_collect/delete',
            body: questionCollectDeleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionCollectById
     * @param id id
     * @returns BaseResponse_QuestionCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static getQuestionCollectByIdUsingPost(
id: number,
): CancelablePromise<BaseResponse_QuestionCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_collect/get',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionCollectByPage
     * @param questionCollectQueryRequest questionCollectQueryRequest
     * @returns BaseResponse_Page_QuestionCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionCollectByPageUsingPost(
questionCollectQueryRequest: QuestionCollectQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_collect/list/page',
            body: questionCollectQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionCollectByPageUser
     * @param questionCollectQueryRequest questionCollectQueryRequest
     * @returns BaseResponse_Page_QuestionCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionCollectByPageUserUsingPost(
questionCollectQueryRequest: QuestionCollectQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_collect/list/page/user',
            body: questionCollectQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
