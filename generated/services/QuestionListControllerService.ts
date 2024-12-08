/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionList_ } from '../models/BaseResponse_Page_QuestionList_';
import type { BaseResponse_Page_QuestionListVO_ } from '../models/BaseResponse_Page_QuestionListVO_';
import type { BaseResponse_QuestionList_ } from '../models/BaseResponse_QuestionList_';
import type { QuestionListAddRequest } from '../models/QuestionListAddRequest';
import type { QuestionListQueryRequest } from '../models/QuestionListQueryRequest';
import type { QuestionListUpdateRequest } from '../models/QuestionListUpdateRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionListControllerService {

    /**
     * addQuestionList
     * @param questionListAddRequest questionListAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionListUsingPost(
questionListAddRequest: QuestionListAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list/add',
            body: questionListAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestionList
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionListUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list/delete',
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
     * getQuestionListById
     * @param id id
     * @returns BaseResponse_QuestionList_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static getQuestionListByIdUsingPost(
id: number,
): CancelablePromise<BaseResponse_QuestionList_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list/get',
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
     * listQuestionListByPage
     * @param questionListQueryRequest questionListQueryRequest
     * @returns BaseResponse_Page_QuestionList_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionListByPageUsingPost(
questionListQueryRequest: QuestionListQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionList_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list/list/page',
            body: questionListQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionListByPageUser
     * @param questionListQueryRequest questionListQueryRequest
     * @returns BaseResponse_Page_QuestionListVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionListByPageUserUsingPost(
questionListQueryRequest: QuestionListQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionListVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list/list/page/user',
            body: questionListQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * updateQuestionList
     * @param questionListUpdateRequest questionListUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionListUsingPost(
questionListUpdateRequest: QuestionListUpdateRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_list/update',
            body: questionListUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
