import { Action } from 'redux';

import { TCreateEventResult } from '../reducers/calendarEvent';
import { CREATE_EVENT, DELETE_EVENT, EDIT_EVENT, FETCH_EVENT, PRESS_EVENT, UPDATE_EVENT } from './actionsTypes';

interface ICreateEventRequest extends Action {
	data: TCreateEventResult;
}

interface ICreateEventSuccess extends Action {
	data: TCreateEventResult;
}

interface ICreateEventFailure extends Action {
	err: any;
}

export type TActionCreateEvent = ICreateEventRequest & ICreateEventSuccess & ICreateEventFailure;

export function editEvent(data: TCreateEventResult): ICreateEventRequest {
	return {
		type: EDIT_EVENT.REQUEST,
		data
	};
}

export function cancelEventEdit() {
	return {
		type: EDIT_EVENT.CANCEL
	};
}

export function updateEventRequest() {
	return {
		type: UPDATE_EVENT.REQUEST
	};
}

export function updateEventSuccess() {
	return {
		type: UPDATE_EVENT.SUCCESS
	};
}

export function deleteEventRequest(eventId: string) {
	return {
		type: DELETE_EVENT.REQUEST,
		data: eventId
	};
}

export function deleteEventSuccess() {
	return {
		type: DELETE_EVENT.SUCCESS
	};
}

export function createEventDraft(data: TCreateEventResult): ICreateEventRequest {
	return {
		type: CREATE_EVENT.DRAFT,
		data
	};
}

export function createEventRequest() {
	console.log('so this got called');
	return {
		type: CREATE_EVENT.REQUEST
	};
}

export function createEventSuccess(data: TCreateEventResult): ICreateEventSuccess {
	return {
		type: CREATE_EVENT.SUCCESS,
		data
	};
}

export function createEventFailure(err: any): ICreateEventFailure {
	return {
		type: CREATE_EVENT.FAILURE,
		err
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

export function pressEventRequest(data: any) {
	return {
		type: PRESS_EVENT.REQUEST,
		data
	};
}

export function pressEventSuccess(data: any) {
	return {
		type: PRESS_EVENT.SUCCESS,
		data
	};
}

export function pressEventFailure(err: any) {
	return {
		type: PRESS_EVENT.FAILURE,
		err
	};
}
