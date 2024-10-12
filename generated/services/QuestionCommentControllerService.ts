/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionComment_ } from '../models/BaseResponse_Page_QuestionComment_';
import type { BaseResponse_QuestionComment_ } from '../models/BaseResponse_QuestionComment_';
import type { BaseResponse_QuestionCommentVO_ } from '../models/BaseResponse_QuestionCommentVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionCommentAddRequest } from '../models/QuestionCommentAddRequest';
import type { QuestionCommentQueryRequest } from '../models/QuestionCommentQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionCommentControllerService {

    /**
     * deleteQuestionComment
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionCommentUsingPost(
deleteRequest: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_comment/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionCommentByid
     * @param id id
     * @returns BaseResponse_QuestionComment_ OK
     * @throws ApiError
     */
    public static getQuestionCommentByidUsingGet(
id: number,
): CancelablePromise<BaseResponse_QuestionComment_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/question_comment/get',
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
     * likeQuestionComment
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static likeQuestionCommentUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_comment/like',
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
     * listQuestionComment
     * @param questionCommentQueryRequest questionCommentQueryRequest
     * @returns BaseResponse_QuestionCommentVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionCommentUsingPost(
questionCommentQueryRequest: QuestionCommentQueryRequest,
): CancelablePromise<BaseResponse_QuestionCommentVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_comment/list',
            body: questionCommentQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionCommentByPage
     * @param questionCommentQueryRequest questionCommentQueryRequest
     * @returns BaseResponse_Page_QuestionComment_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionCommentByPageUsingPost(
questionCommentQueryRequest: QuestionCommentQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionComment_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_comment/list/page',
            body: questionCommentQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * publishQuestionComment
     * @param questionCommentAddRequest questionCommentAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static publishQuestionCommentUsingPost(
questionCommentAddRequest: QuestionCommentAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_comment/publish',
            body: questionCommentAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
