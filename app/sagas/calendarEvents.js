import { delay, put, select, takeLatest } from 'redux-saga/effects';

import { FETCH_EVENT } from '../actions/actionsTypes';
import { Services } from '../lib/services';
import { fetchEventSuccess, fetchEventFailure } from '../actions/calendarEvents';

function groupEventsByDate(events) {
    // Helper function to parse ISO date and remove the time part
    const parseDate = (dateString) => new Date(dateString).toISOString().split('T')[0];

    // Grouping events by date
    const grouped = events.reduce((acc, { _id, event }) => {
        const dateKey = parseDate(event.date);
        const item = {
            id: _id,
            title: event.title,
            date: dateKey,
            time: event.time,
            meetingLink: event.meetingLink,
            description: event.description,
            peers: event.peers
        };

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});

    // Transforming into the required format
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
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
