import { createSelector } from 'reselect';

import { IApplicationState } from '../definitions';

const getEvent = (state: IApplicationState) => state.createEvent;

export const getEventSelector = createSelector([getEvent], event => event);

const getPopup = (state: IApplicationState) => state.confirmationPopup;
export const getPopupSelector = createSelector([getPopup], confirmationPopup => confirmationPopup);
