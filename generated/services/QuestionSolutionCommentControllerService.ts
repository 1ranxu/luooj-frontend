/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionSolutionComment_ } from '../models/BaseResponse_Page_QuestionSolutionComment_';
import type { BaseResponse_QuestionSolutionComment_ } from '../models/BaseResponse_QuestionSolutionComment_';
import type { BaseResponse_QuestionSolutionCommentVO_ } from '../models/BaseResponse_QuestionSolutionCommentVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionSolutionCommentAddRequest } from '../models/QuestionSolutionCommentAddRequest';
import type { QuestionSolutionCommentQueryRequest } from '../models/QuestionSolutionCommentQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionSolutionCommentControllerService {

    /**
     * deleteQuestionSolutionComment
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionSolutionCommentUsingPost(
deleteRequest: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_comment/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionSolutionCommentByid
     * @param id id
     * @returns BaseResponse_QuestionSolutionComment_ OK
     * @throws ApiError
     */
    public static getQuestionSolutionCommentByidUsingGet(
id: number,
): CancelablePromise<BaseResponse_QuestionSolutionComment_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/question_solution_comment/get',
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
     * likeQuestionSolutionComment
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static likeQuestionSolutionCommentUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_comment/like',
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
     * listQuestionSolutionComment
     * @param questionSolutionCommentQueryRequest questionSolutionCommentQueryRequest
     * @returns BaseResponse_QuestionSolutionCommentVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionCommentUsingPost(
questionSolutionCommentQueryRequest: QuestionSolutionCommentQueryRequest,
): CancelablePromise<BaseResponse_QuestionSolutionCommentVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_comment/list',
            body: questionSolutionCommentQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionSolutionCommentByPage
     * @param questionSolutionCommentQueryRequest questionSolutionCommentQueryRequest
     * @returns BaseResponse_Page_QuestionSolutionComment_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionCommentByPageUsingPost(
questionSolutionCommentQueryRequest: QuestionSolutionCommentQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSolutionComment_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_comment/list/page',
            body: questionSolutionCommentQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * publishQuestionSolutionComment
     * @param questionSolutionCommentAddRequest questionSolutionCommentAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static publishQuestionSolutionCommentUsingPost(
questionSolutionCommentAddRequest: QuestionSolutionCommentAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_comment/publish',
            body: questionSolutionCommentAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
