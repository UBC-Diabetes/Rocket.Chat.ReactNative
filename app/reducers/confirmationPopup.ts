export interface IPopup {
	showConfirmationPopup: boolean;
	confirmationPopupDetails: any;
}

const initialState: IPopup = {
	showConfirmationPopup: false,
	confirmationPopupDetails: null
};

export default function confirmationPopupReducer(state = initialState, action) {
	switch (action.type) {
		case 'SHOW_CONFIRMATION_POPUP':
			return {
				...state,
				showConfirmationPopup: true,
				confirmationPopupDetails: action.data.eventDetails
			};
		case 'HIDE_CONFIRMATION_POPUP':
			return {
				...state,
				showConfirmationPopup: false
			};
		default:
			return state;
	}
}
