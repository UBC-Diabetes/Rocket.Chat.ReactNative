import { TApplicationActions } from '../definitions';
import { CREATE_EVENT, FETCH_EVENT, PRESS_EVENT } from '../actions/actionsTypes';

interface ICreateEventResult {
	author?: string;
	title?: string;
	description?: string;
	date?: string | Date;
	time?: string;
	meetingLink?: string;
	peers?: string[];
}

export type TCreateEventResult = ICreateEventResult;

export type TCreateEventDraft = {
	author?: string;
};

export interface ICreateEvent {
	isFetching: boolean;
	isDrafting: boolean;
	failure: boolean;
	error: any;
	author?: string;
	title?: string;
	description?: string;
	date?: string;
	time?: string;
	meetingLink?: string;
	pressedEvent: {};
	fetchedEvents: ICreateEventResult[];
	peers?: string[];
	numGuests?: number;
}

export const initialState: ICreateEvent = {
	isFetching: false,
	failure: false,
	isDrafting: false,
	pressedEvent: {},
	fetchedEvents: [],
	error: {}
};

export default function (state = initialState, action: TApplicationActions): ICreateEvent {
	switch (action.type) {
		case CREATE_EVENT.DRAFT:
			return {
				...state,
				isFetching: false,
				failure: false,
				error: {},
				isDrafting: true,
				draftEvent: {
					...action.data
				}
			};
		case CREATE_EVENT.REQUEST:
			return {
				...state,
				isFetching: true,
				isDrafting: false,
				failure: false,
				error: {}
			};
		case CREATE_EVENT.SUCCESS:
			return {
				...state,
				isFetching: false,
				failure: false,
				isDrafting: false,
				createdEvent: action.data
			};
		case CREATE_EVENT.FAILURE:
			return {
				...state,
				isFetching: false,
				failure: true,
				isDrafting: false,
				createdEvent: action.err
			};
		case FETCH_EVENT.REQUEST:
			return {
				...state,
				isFetching: true,
				failure: false,
				isDrafting: false,
				fetchedEvents: {
					error: {}
				}
			};
		case FETCH_EVENT.SUCCESS:
			return {
				...state,
				isFetching: false,
				failure: false,
				isDrafting: false,
				fetchedEvents: action.data
			};
		case FETCH_EVENT.FAILURE:
			return {
				...state,
				isFetching: false,
				failure: true,
				isDrafting: false,
				fetchedEvents: action.err
			};
		case PRESS_EVENT.REQUEST:
			return {
				...state,
				isFetching: false,
				failure: false,
				isDrafting: false,
				pressedEvent: action.data
			};
		case PRESS_EVENT.SUCCESS:
			return {
				...state,
				isFetching: false,
				failure: false
			};
		case PRESS_EVENT.FAILURE:
			return {
				...state,
				isFetching: false,
				failure: true
			};
		default:
			return state;
	}
}
