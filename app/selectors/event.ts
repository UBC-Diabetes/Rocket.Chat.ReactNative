import { createSelector } from 'reselect';

import { IApplicationState } from '../definitions';

const getEvent = (state: IApplicationState) => state.createEvent;

export const getEventSelector = createSelector([getEvent], event => event);

const getPopup = (state: IApplicationState) => state.confirmationPopup;
export const getPopupSelector = createSelector([getPopup], confirmationPopup => confirmationPopup);

const getCalendarEvents = (state: IApplicationState) => state.calendarEvents;
export const getCalendarEventsSelector = createSelector([getCalendarEvents], calendarEvents =>
	calendarEvents.result.length
		? calendarEvents.result.map(e => ({
				title: e.event.title,
				data: [e.event]
		  }))
		: []
);
