/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptedQuestion } from '../models/AcceptedQuestion';
import type { Question } from '../models/Question';
import type { QuestionSubmit } from '../models/QuestionSubmit';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionInnerControllerService {

    /**
     * addAcceptedQuestion
     * @param questionId questionId
     * @param userId userId
     * @returns boolean OK
     * @returns any Created
     * @throws ApiError
     */
    public static addAcceptedQuestionUsingPost(
questionId: number,
userId: number,
): CancelablePromise<boolean | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/inner/accepted_question/add',
            query: {
                'questionId': questionId,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getAcceptedQuestion
     * @param questionId questionId
     * @param userId userId
     * @returns AcceptedQuestion OK
     * @returns any Created
     * @throws ApiError
     */
    public static getAcceptedQuestionUsingPost(
questionId: number,
userId: number,
): CancelablePromise<AcceptedQuestion | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/inner/accepted_question/get',
            query: {
                'questionId': questionId,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionById
     * @param questionId questionId
     * @returns Question OK
     * @throws ApiError
     */
    public static getQuestionByIdUsingGet1(
questionId: number,
): CancelablePromise<Question> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/inner/get/id',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionSubmitById
     * @param questionSubmitId questionSubmitId
     * @returns QuestionSubmit OK
     * @throws ApiError
     */
    public static getQuestionSubmitByIdUsingGet(
questionSubmitId: number,
): CancelablePromise<QuestionSubmit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/inner/question_submit/get/id',
            query: {
                'questionSubmitId': questionSubmitId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * updateQuestionSubmitById
     * @param questionSubmit questionSubmit
     * @returns boolean OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionSubmitByIdUsingPost(
questionSubmit: QuestionSubmit,
): CancelablePromise<boolean | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/inner/question_submit/update',
            body: questionSubmit,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * updateQuestionById
     * @param question question
     * @returns boolean OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionByIdUsingPost(
question: Question,
): CancelablePromise<boolean | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/inner/update',
            body: question,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
