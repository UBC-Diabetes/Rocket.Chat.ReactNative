import { TApplicationActions } from '../definitions';
import { CREATE_EVENT } from '../actions/actionsTypes';

interface ICreateEventResult {
	name: string;
	users: string[];
	teamId?: string;
	type: boolean;
	readOnly: boolean;
	encrypted: boolean;
	broadcast: boolean;
	isTeam: boolean;
}

interface ICreateEventResultOnlyGroup {
	group: boolean;
}

export type TCreateEventResult = ICreateEventResult | ICreateEventResultOnlyGroup;

export interface ICreateEvent {
	isFetching: boolean;
	failure: boolean;
	result: TCreateEventResult | {};
	error: any;
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
				isFetching: true,
				failure: false,
				error: {}
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
