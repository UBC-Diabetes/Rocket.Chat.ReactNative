import { Action } from 'redux';

import { TCreateEventResult } from '../reducers/calendarEvent';
import { CREATE_EVENT, FETCH_EVENT } from './actionsTypes';

interface ICreateEventRequest extends Action {
	data: TCreateEventResult;
}

interface ICreateEventSuccess extends Action {
	data: TCreateEventResult;
}

interface ICreateEventFailure extends Action {
	err: any;
	isTeam: boolean;
}

export type TActionCreateEvent = ICreateEventRequest & ICreateEventSuccess & ICreateEventFailure;

export function createEventDraft(data: TCreateEventResult): ICreateEventRequest {
	return {
		type: CREATE_EVENT.DRAFT,
		data
	};
}

export function createEventRequest(data: TCreateEventResult): ICreateEventRequest {
	return {
		type: CREATE_EVENT.REQUEST,
		data
	};
}

export function createEventSuccess(data: TCreateEventResult): ICreateEventSuccess {
	return {
		type: CREATE_EVENT.SUCCESS,
		data
	};
}

export function createEventFailure(err: any, isTeam: boolean): ICreateEventFailure {
	return {
		type: CREATE_EVENT.FAILURE,
		err,
		isTeam
	};
}

export function fetchEventRequest() {
	return {
		type: FETCH_EVENT.REQUEST
	};
}

export function fetchEventSuccess(data: any) {
	return {
		type: FETCH_EVENT.SUCCESS,
		data
	};
}

export function fetchEventFailure(err: any) {
	return {
		type: FETCH_EVENT.FAILURE,
		err
	};
}
