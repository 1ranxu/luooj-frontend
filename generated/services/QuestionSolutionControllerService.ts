/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionSolution_ } from '../models/BaseResponse_Page_QuestionSolution_';
import type { BaseResponse_QuestionSolution_ } from '../models/BaseResponse_QuestionSolution_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionSolutionAddRequest } from '../models/QuestionSolutionAddRequest';
import type { QuestionSolutionQueryRequest } from '../models/QuestionSolutionQueryRequest';
import type { QuestionSolutionUpdateRequest } from '../models/QuestionSolutionUpdateRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionSolutionControllerService {

    /**
     * addQuestionSolution
     * @param questionSolutionAddRequest questionSolutionAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionSolutionUsingPost(
questionSolutionAddRequest: QuestionSolutionAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution/add',
            body: questionSolutionAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestionSolution
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionSolutionUsingPost(
deleteRequest: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionSolutionById
     * @param id id
     * @returns BaseResponse_QuestionSolution_ OK
     * @throws ApiError
     */
    public static getQuestionSolutionByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_QuestionSolution_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/question_solution/get',
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
     * likeQuestionSolution
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static likeQuestionSolutionUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution/like',
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
     * listQuestionSolutionByPage
     * @param questionSolutionQueryRequest questionSolutionQueryRequest
     * @returns BaseResponse_Page_QuestionSolution_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionByPageUsingPost(
questionSolutionQueryRequest: QuestionSolutionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSolution_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution/list/page',
            body: questionSolutionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionSolutionByPageUser
     * @param questionSolutionQueryRequest questionSolutionQueryRequest
     * @returns BaseResponse_Page_QuestionSolution_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionByPageUserUsingPost(
questionSolutionQueryRequest: QuestionSolutionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSolution_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution/list/page/user',
            body: questionSolutionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * updateQuestionSolution
     * @param questionSolutionUpdateRequest questionSolutionUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionSolutionUsingPost(
questionSolutionUpdateRequest: QuestionSolutionUpdateRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution/update',
            body: questionSolutionUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
