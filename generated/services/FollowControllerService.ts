/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_UserVO_ } from '../models/BaseResponse_List_UserVO_';
import type { BaseResponse_Page_UserVO_ } from '../models/BaseResponse_Page_UserVO_';
import type { FansQueryRequest } from '../models/FansQueryRequest';
import type { FollowQueryRequest } from '../models/FollowQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FollowControllerService {

    /**
     * follow
     * @param isFollow isFollow
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static followUsingPost(
isFollow?: boolean,
userId?: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/follow',
            query: {
                'isFollow': isFollow,
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
     * common
     * @param userId userId
     * @returns BaseResponse_List_UserVO_ OK
     * @throws ApiError
     */
    public static commonUsingGet(
userId?: number,
): CancelablePromise<BaseResponse_List_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/follow/common',
            query: {
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
     * getFansPage
     * @param fansQueryRequest fansQueryRequest
     * @returns BaseResponse_Page_UserVO_ OK
     * @throws ApiError
     */
    public static getFansPageUsingGet(
fansQueryRequest: FansQueryRequest,
): CancelablePromise<BaseResponse_Page_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/follow/get/fans/page',
            body: fansQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getFollowPage
     * @param followQueryRequest followQueryRequest
     * @returns BaseResponse_Page_UserVO_ OK
     * @throws ApiError
     */
    public static getFollowPageUsingGet(
followQueryRequest: FollowQueryRequest,
): CancelablePromise<BaseResponse_Page_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/follow/get/follow/page',
            body: followQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * isFollow
     * @param userId userId
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static isFollowUsingGet(
userId?: number,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/follow/or/not',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
