/* @flow */

import { FPTI_KEY } from '@paypal/sdk-constants';
import { strHashStr } from 'belter';

import type { ExpressRequest } from '../../types';
import { ROOT_TRANSACTION_NAME } from './constants';

type SetRootTransactionOptions = {|
    userIDToken : ?string,
    clientAccessToken : ?string
|};

type IdentityTrackingPayload = {
    [ string ] : mixed
};

const FPTI_BUTTON_LOAD_SERVER = 'process_button_load_server';
const FPTI_BUTTON_SESSION_ID = 'button_session_id';
const FPTI_IDENTIFIER_MECHANISMS = {
    USER_SESSION_COOKIE: 'user_session_cookie',
    VISITOR_ID_COOKIE:     'visitor_id_cookie',
    ULAT_COOKIE: 'ulat_cookie',
    ACCESS_TOKEN_COOKIE:   'access_token_cookie',
    REFRESH_TOKEN_COOKIE: 'refresh_token_cookie',
    SCID_COOKIE: 'scid_cookie',
    ID_TOKEN_COOKIE: 'id_token',
    LOGIN_EMAIL_COOKIE:    'login_email',
    REMEMBERED_USER_COOKIE: 'remembered_user_cookie',
    USER_DEVICE_TOKEN_COOKIE: 'user_device_token_cookie',
    TRACKING_COOKIE: 'tracking_cookie',

};

export function setRootTransaction(req : ExpressRequest, { userIDToken, clientAccessToken } : SetRootTransactionOptions) {
    const model = req.model = req.model || {};
    const rootTxn = model.rootTxn = model.rootTxn || {};

    if (userIDToken) {
        rootTxn.name = ROOT_TRANSACTION_NAME.SMART_BUTTONS_WALLET;
    } else if (clientAccessToken) {
        rootTxn.name = ROOT_TRANSACTION_NAME.SMART_BUTTONS_VAULT;
    } else {
        rootTxn.name = ROOT_TRANSACTION_NAME.SMART_BUTTONS;
    }
}

export function getIdentityTrackingPayload(req : ExpressRequest, buttonSessionID : string) : IdentityTrackingPayload {
    return {
        [FPTI_KEY.TRANSITION]:              FPTI_BUTTON_LOAD_SERVER,
        [FPTI_KEY.CONTEXT_TYPE]:            FPTI_BUTTON_SESSION_ID,
        [FPTI_KEY.CONTEXT_ID]:              buttonSessionID,
        [FPTI_KEY.USER_IDENTITY_METHOD]:    {
            [FPTI_IDENTIFIER_MECHANISMS.LOGIN_EMAIL_COOKIE]: {
                id:     strHashStr(req.cookies.login_email),
                source: 'Login Email Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.VISITOR_ID_COOKIE]: {
                id:     req.cookies.visitor_id,
                source: 'Visitor ID Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.USER_SESSION_COOKIE]: {
                id:     req.cookies.user_session,
                source: 'User Session Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.ULAT_COOKIE]: {
                id:     req.cookies.ulat,
                source: 'User Session (ULAT) Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.ACCESS_TOKEN_COOKIE]: {
                id:     req.cookies.access_token,
                source: 'Access Token Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.REFRESH_TOKEN_COOKIE]: {
                id:     req.cookies.refresh_token,
                source: 'Refresh Token Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.SCID_COOKIE]: {
                id:     req.cookies.scid,
                source: 'SCID Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.ID_TOKEN_COOKIE]: {
                id:     req.cookies.id_token,
                source: 'ID Token Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.USER_DEVICE_TOKEN_COOKIE]: {
                id:     req.cookies.udt,
                source: 'User Device Token (Web LLS) Cookie'
            },
            [FPTI_IDENTIFIER_MECHANISMS.TRACKING_COOKIE]: {
                id:     req.cookies.ts,
                source: 'Tracking Cookie'
            },
        }
    };
}
