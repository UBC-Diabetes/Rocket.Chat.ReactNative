import { delay, put, select, takeLatest } from 'redux-saga/effects';
import { parse, format } from 'date-fns';

import { CREATE_EVENT ,FETCH_EVENT } from '../actions/actionsTypes';
import { Services } from '../lib/services';

import {
    createEventSuccess,
    createEventFailure,
    fetchEventRequest,
    fetchEventSuccess,
    fetchEventFailure
    } from '../actions/calendarEvents';


function convertDateToISO(dateString) {
    // Parse the date from MM/DD/YYYY format
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());

    // Format it to ISO (YYYY-MM-DD)
    return format(parsedDate, 'yyyy-MM-dd');
}


const parseDate = (dateString) => {
    if (!dateString) {
        return 'unknown-date';
    }
    try {
        return convertDateToISO(dateString);
    } catch (error) {
        console.error('Date conversion error:', error);
    }
};

function groupEventsByDate(events) {
    try {
        const grouped = events.reduce((acc, { _id, event }) => {
            const dateKey = parseDate(event.date);
            const item = {
                id: _id,
                ...event
            };

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);
            return acc;
        }, {});

        return Object.entries(grouped).map(([title, data]) => ({ title, data }));
    } catch (error) {
        console.error('Error in groupEventsByDate:', error);
        return [];
    }
}


const handleFetchRequest = function* handleFetchCalendarEvents() {

  const { success, events, error } = yield Services.getCalendarEvents();

  const groupedEvents = groupEventsByDate(events);

  if (success) {
		yield put(fetchEventSuccess(groupedEvents));
  } else {
		yield put(fetchEventFailure(error));
  }

};

const handleCreateRequest = function* handleCreateCalendarEvent() {

  const response = yield Services.createCalendarEvent();
  const { success, error } = response;

  if (success) {
		yield put(createEventSuccess());
  } else {
		yield put(createEventFailure(error));
  }

};

const handleCreateSuccess = function* handleCreateEventSuccess() {
		yield put(fetchEventRequest());
};




const root = function* root() {
	yield takeLatest(FETCH_EVENT.REQUEST, handleFetchRequest);
	yield takeLatest(CREATE_EVENT.REQUEST, handleCreateRequest);
	yield takeLatest(CREATE_EVENT.SUCCESS, handleCreateSuccess);
};

export default root;
