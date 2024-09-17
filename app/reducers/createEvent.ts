import { TApplicationActions } from '../definitions';
import { CREATE_EVENT } from '../actions/actionsTypes';

interface ICreateEventResult {
	author?: string;
	title?: string;
	description?: string;
	date?: string | Date;
	time?: string;
	zoomLink?: string;
	peers?: string[];
}

export type TCreateEventResult = ICreateEventResult;

export type TCreateEventDraft = {
	author?: string;
};

export interface ICreateEvent {
	isFetching: boolean;
	failure: boolean;
	result: TCreateEventResult | {};
	error: any;
	author?: string;
	title?: string;
	description?: string;
	date?: string;
	time?: string;
	zoomLink?: string;
	peers?: string[];
	numGuests?: number;
}

export const initialState: ICreateEvent = {
	isFetching: false,
	failure: false,
	result: {},
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
				...action.data
			};
		case CREATE_EVENT.REQUEST:
			return {
				...state,
				isFetching: true,
				failure: false,
				error: {}
			};
		case CREATE_EVENT.SUCCESS:
			return {
				...state,
				isFetching: false,
				failure: false,
				result: action.data
			};
		case CREATE_EVENT.FAILURE:
			return {
				...state,
				isFetching: false,
				failure: true,
				error: action.err
			};
		default:
			return state;
	}
}
