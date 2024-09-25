import { delay, put, select, takeLatest } from 'redux-saga/effects';
import { parse, format } from 'date-fns';

import { FETCH_EVENT } from '../actions/actionsTypes';
import { Services } from '../lib/services';

import { fetchEventSuccess, fetchEventFailure } from '../actions/calendarEvents';


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


const handleRequest = function* handleFetchCalendarEvents() {

  const { success, events, error } = yield Services.getCalendarEvents();

  const groupedEvents = groupEventsByDate(events);

  if (success) {
		yield put(fetchEventSuccess(groupedEvents));
  } else {
		yield put(fetchEventFailure(error));
  }

};


const root = function* root() {
	yield takeLatest(FETCH_EVENT.REQUEST, handleRequest);
};

export default root;
