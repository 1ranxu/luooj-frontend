/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_CommentReport_ } from '../models/BaseResponse_CommentReport_';
import type { BaseResponse_Page_CommentReport_ } from '../models/BaseResponse_Page_CommentReport_';
import type { CommentDeleteRequest } from '../models/CommentDeleteRequest';
import type { CommentReportAddRequest } from '../models/CommentReportAddRequest';
import type { CommentReportQueryRequest } from '../models/CommentReportQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CommentReportControllerService {

    /**
     * addCommentReport
     * @param commentReportAddRequest commentReportAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addCommentReportUsingPost(
commentReportAddRequest: CommentReportAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/comment_report/add',
            body: commentReportAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteCommentReport
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteCommentReportUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/comment_report/delete',
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
     * deleteCommentAfterConfirm
     * @param commentDeleteRequest commentDeleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteCommentAfterConfirmUsingPost(
commentDeleteRequest: CommentDeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/comment_report/delete_comment/after_confim',
            body: commentDeleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getCommentReportById
     * @param id id
     * @returns BaseResponse_CommentReport_ OK
     * @throws ApiError
     */
    public static getCommentReportByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_CommentReport_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/comment_report/get',
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
     * listCommentReportByPage
     * @param commentReportQueryRequest commentReportQueryRequest
     * @returns BaseResponse_Page_CommentReport_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listCommentReportByPageUsingPost(
commentReportQueryRequest: CommentReportQueryRequest,
): CancelablePromise<BaseResponse_Page_CommentReport_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/comment_report/list/page',
            body: commentReportQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
