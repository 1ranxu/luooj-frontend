/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_ContestApply_ } from '../models/BaseResponse_ContestApply_';
import type { BaseResponse_Page_ContestApply_ } from '../models/BaseResponse_Page_ContestApply_';
import type { ContestApplyAddRequest } from '../models/ContestApplyAddRequest';
import type { ContestApplyQueryRequest } from '../models/ContestApplyQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContestApplyControllerService {

    /**
     * applyContest
     * @param contestApplyAddRequest contestApplyAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static applyContestUsingPost(
contestApplyAddRequest: ContestApplyAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_apply/apply',
            body: contestApplyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getContestApplyById
     * @param id id
     * @returns BaseResponse_ContestApply_ OK
     * @throws ApiError
     */
    public static getContestApplyByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_ContestApply_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/contest_apply/get',
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
     * listContestApplyByPage
     * @param contestApplyQueryRequest contestApplyQueryRequest
     * @returns BaseResponse_Page_ContestApply_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listContestApplyByPageUsingPost(
contestApplyQueryRequest: ContestApplyQueryRequest,
): CancelablePromise<BaseResponse_Page_ContestApply_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_apply/list/page',
            body: contestApplyQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
