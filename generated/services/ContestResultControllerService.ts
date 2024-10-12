/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_ContestResult_ } from '../models/BaseResponse_ContestResult_';
import type { BaseResponse_Page_ContestRank_ } from '../models/BaseResponse_Page_ContestRank_';
import type { BaseResponse_Page_ContestResult_ } from '../models/BaseResponse_Page_ContestResult_';
import type { BaseResponse_QuestionSubmitJudgeInfo_ } from '../models/BaseResponse_QuestionSubmitJudgeInfo_';
import type { BaseResponse_RunCodeResponse_ } from '../models/BaseResponse_RunCodeResponse_';
import type { ContestQuestionSubmit } from '../models/ContestQuestionSubmit';
import type { ContestResultQueryRequest } from '../models/ContestResultQueryRequest';
import type { RunCodeRequest } from '../models/RunCodeRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContestResultControllerService {

    /**
     * deleteContestResult
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteContestResultUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_result/delete',
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
     * getContestResultById
     * @param id id
     * @returns BaseResponse_ContestResult_ OK
     * @throws ApiError
     */
    public static getContestResultByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_ContestResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/contest_result/get',
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
     * listContestResultByPage
     * @param contestResultQueryRequest contestResultQueryRequest
     * @returns BaseResponse_Page_ContestResult_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listContestResultByPageUsingPost(
contestResultQueryRequest: ContestResultQueryRequest,
): CancelablePromise<BaseResponse_Page_ContestResult_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_result/list/page',
            body: contestResultQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * contestQuestionRun
     * @param runCodeRequest runCodeRequest
     * @returns BaseResponse_RunCodeResponse_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static contestQuestionRunUsingPost(
runCodeRequest: RunCodeRequest,
): CancelablePromise<BaseResponse_RunCodeResponse_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_result/run',
            body: runCodeRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * contestRankStatistics
     * @param contestResultQueryRequest contestResultQueryRequest
     * @returns BaseResponse_Page_ContestRank_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static contestRankStatisticsUsingPost(
contestResultQueryRequest: ContestResultQueryRequest,
): CancelablePromise<BaseResponse_Page_ContestRank_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_result/statistics',
            body: contestResultQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * contestQuestionSubmit
     * @param contestQuestionSubmit contestQuestionSubmit
     * @returns BaseResponse_QuestionSubmitJudgeInfo_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static contestQuestionSubmitUsingPost(
contestQuestionSubmit: ContestQuestionSubmit,
): CancelablePromise<BaseResponse_QuestionSubmitJudgeInfo_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/contest_result/submit',
            body: contestQuestionSubmit,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
