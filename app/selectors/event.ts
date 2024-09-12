import { createSelector } from 'reselect';

import { IApplicationState } from '../definitions';

const getEvent = (state: IApplicationState) => state.createEvent;

export const getEventSelector = createSelector([getEvent], event => event);
