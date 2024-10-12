/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionListCollect_ } from '../models/BaseResponse_Page_QuestionListCollect_';
import type { BaseResponse_QuestionListCollect_ } from '../models/BaseResponse_QuestionListCollect_';
import type { QuestionListCollectAddRequest } from '../models/QuestionListCollectAddRequest';
import type { QuestionListCollectDeleteRequest } from '../models/QuestionListCollectDeleteRequest';
import type { QuestionListCollectQueryRequest } from '../models/QuestionListCollectQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionListCollectControllerService {

    /**
     * addQuestionListCollect
     * @param questionListCollectAddRequest questionListCollectAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionListCollectUsingPost(
questionListCollectAddRequest: QuestionListCollectAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list_collect/add',
            body: questionListCollectAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestionListCollect
     * @param questionListCollectDeleteRequest questionListCollectDeleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionListCollectUsingPost(
questionListCollectDeleteRequest: QuestionListCollectDeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list_collect/delete',
            body: questionListCollectDeleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionListCollectById
     * @param id id
     * @returns BaseResponse_QuestionListCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static getQuestionListCollectByIdUsingPost(
id: number,
): CancelablePromise<BaseResponse_QuestionListCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list_collect/get',
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
     * listQuestionListCollectByPage
     * @param questionListCollectQueryRequest questionListCollectQueryRequest
     * @returns BaseResponse_Page_QuestionListCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionListCollectByPageUsingPost(
questionListCollectQueryRequest: QuestionListCollectQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionListCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list_collect/list/page',
            body: questionListCollectQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionListCollectByPageUser
     * @param questionListCollectQueryRequest questionListCollectQueryRequest
     * @returns BaseResponse_Page_QuestionListCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionListCollectByPageUserUsingPost(
questionListCollectQueryRequest: QuestionListCollectQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionListCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list_collect/list/page/user',
            body: questionListCollectQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
