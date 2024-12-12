/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionSolutionCollect_ } from '../models/BaseResponse_Page_QuestionSolutionCollect_';
import type { QuestionSolutionCollectAddRequest } from '../models/QuestionSolutionCollectAddRequest';
import type { QuestionSolutionCollectQueryRequest } from '../models/QuestionSolutionCollectQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionSolutionCollectControllerService {

    /**
     * addQuestionSolutionCollect
     * @param questionSolutionCollectAddRequest questionSolutionCollectAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionSolutionCollectUsingPost(
questionSolutionCollectAddRequest: QuestionSolutionCollectAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_collect/add',
            body: questionSolutionCollectAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestionSolutionCollect
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionSolutionCollectUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_collect/delete',
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
     * isQuestionSolutionCollect
     * @param questionSolutionId questionSolutionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static isQuestionSolutionCollectUsingPost(
questionSolutionId: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_collect/isCollect',
            query: {
                'questionSolutionId': questionSolutionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionSolutionCollectByPage
     * @param questionSolutionCollectQueryRequest questionSolutionCollectQueryRequest
     * @returns BaseResponse_Page_QuestionSolutionCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionCollectByPageUsingPost(
questionSolutionCollectQueryRequest: QuestionSolutionCollectQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSolutionCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_collect/list/page',
            body: questionSolutionCollectQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionSolutionCollectByPageUser
     * @param questionSolutionCollectQueryRequest questionSolutionCollectQueryRequest
     * @returns BaseResponse_Page_QuestionSolutionCollect_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionCollectByPageUserUsingPost(
questionSolutionCollectQueryRequest: QuestionSolutionCollectQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSolutionCollect_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_collect/list/page/user',
            body: questionSolutionCollectQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
