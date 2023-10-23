import { camelCaseObject } from '@edx/frontend-platform';
import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchOrganizationListBegin,
  fetchOrganizationListFailure,
  fetchOrganizationListSuccess,
  fetchRealtimeValidationsBegin,
  fetchRealtimeValidationsFailure,
  fetchRealtimeValidationsSuccess,
  REGISTER_FORM_ORGANIZATIONS,
  REGISTER_FORM_VALIDATIONS,
  REGISTER_NEW_USER,
  registerNewUserBegin,
  registerNewUserFailure,
  registerNewUserSuccess,
} from './actions';
import { INTERNAL_SERVER_ERROR } from './constants';
import { getFieldsValidations, registerRequest, getOrganizationsList } from './service';

export function* handleNewUserRegistration(action) {
  try {
    yield put(registerNewUserBegin());

    const { authenticatedUser, redirectUrl, success } = yield call(registerRequest, action.payload.registrationInfo);

    yield put(registerNewUserSuccess(
      camelCaseObject(authenticatedUser),
      redirectUrl,
      success,
    ));
  } catch (e) {
    const statusCodes = [400, 403, 409];
    if (e.response && statusCodes.includes(e.response.status)) {
      yield put(registerNewUserFailure(camelCaseObject(e.response.data)));
      logInfo(e);
    } else {
      yield put(registerNewUserFailure({ errorCode: INTERNAL_SERVER_ERROR }));
      logError(e);
    }
  }
}

export function* fetchRealtimeValidations(action) {
  try {
    yield put(fetchRealtimeValidationsBegin());
    const { fieldValidations } = yield call(getFieldsValidations, action.payload.formPayload);

    yield put(fetchRealtimeValidationsSuccess(camelCaseObject(fieldValidations)));
  } catch (e) {
    if (e.response && e.response.status === 403) {
      yield put(fetchRealtimeValidationsFailure());
      logInfo(e);
    } else {
      logError(e);
    }
  }
}

export function* fetchOrganizationList() {
  try {
    yield put(fetchOrganizationListBegin());
    const { organizationsList } = yield call(getOrganizationsList);

    yield put(fetchOrganizationListSuccess(organizationsList));
  } catch (e) {
    if (e.response && e.response.status === 403) {
      yield put(fetchOrganizationListFailure());
      logInfo(e);
    } else {
      logError(e);
    }
  }
}

export default function* saga() {
  yield takeEvery(REGISTER_NEW_USER.BASE, handleNewUserRegistration);
  yield takeEvery(REGISTER_FORM_VALIDATIONS.BASE, fetchRealtimeValidations);
  yield takeEvery(REGISTER_FORM_ORGANIZATIONS.BASE, fetchOrganizationList);
}
