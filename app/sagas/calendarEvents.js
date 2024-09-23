import { delay, put, select, takeLatest } from 'redux-saga/effects';

import { FETCH_EVENT } from '../actions/actionsTypes';
import { Services } from '../lib/services';
import { fetchEventSuccess, fetchEventFailure } from '../actions/calendarEvents';

const handleRequest = function* handleFetchCalendarEvents() {

  const { success, events, error } = yield Services.getCalendarEvents();

  if (success) {
		yield put(fetchEventSuccess(events));
  } else {
		yield put(fetchEventFailure(error));
  }

};

const root = function* root() {
	yield takeLatest(FETCH_EVENT.REQUEST, handleRequest);
};

export default root;
