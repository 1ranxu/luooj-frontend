/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_Page_QuestionSolutionReport_ } from '../models/BaseResponse_Page_QuestionSolutionReport_';
import type { BaseResponse_QuestionSolutionReport_ } from '../models/BaseResponse_QuestionSolutionReport_';
import type { QuestionSolutionReportAddRequest } from '../models/QuestionSolutionReportAddRequest';
import type { QuestionSolutionReportQueryRequest } from '../models/QuestionSolutionReportQueryRequest';
import type { SolutionDeleteRequest } from '../models/SolutionDeleteRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionSolutionReportControllerService {

    /**
     * addQuestionSolutionReport
     * @param questionSolutionReportAddRequest questionSolutionReportAddRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionSolutionReportUsingPost(
questionSolutionReportAddRequest: QuestionSolutionReportAddRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_report/add',
            body: questionSolutionReportAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestionSolutionReport
     * @param id id
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionSolutionReportUsingPost(
id: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_report/delete',
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
     * deleteQuestionSolutionAfterConfirm
     * @param solutionDeleteRequest solutionDeleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionSolutionAfterConfirmUsingPost(
solutionDeleteRequest: SolutionDeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_report/delete_solution/after_confim',
            body: solutionDeleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionSolutionReportById
     * @param id id
     * @returns BaseResponse_QuestionSolutionReport_ OK
     * @throws ApiError
     */
    public static getQuestionSolutionReportByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_QuestionSolutionReport_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/question_solution_report/get',
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
     * listQuestionSolutionReportByPage
     * @param questionSolutionReportQueryRequest questionSolutionReportQueryRequest
     * @returns BaseResponse_Page_QuestionSolutionReport_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSolutionReportByPageUsingPost(
questionSolutionReportQueryRequest: QuestionSolutionReportQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSolutionReport_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question_solution_report/list/page',
            body: questionSolutionReportQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
