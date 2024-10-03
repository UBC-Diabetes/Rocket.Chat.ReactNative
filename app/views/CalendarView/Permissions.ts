import { Platform } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import * as Permissions from 'react-native-permissions';

const eventConfig = {
	title: 'whatever'
	// and other options
};

const addToPersonalCalendar = event =>
	Permissions.request(
		Platform.select({
			ios: Permissions.PERMISSIONS.IOS.CALENDARS_WRITE_ONLY,
			android: Permissions.PERMISSIONS.ANDROID.WRITE_CALENDAR
		})
	)
		.then(result => {
			if (result !== Permissions.RESULTS.GRANTED) {
				return;
			}
			return AddCalendarEvent.presentEventCreatingDialog(eventConfig);
		})
		.then((eventInfo: { calendarItemIdentifier: string; eventIdentifier: string }) => {
			// handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
			// These are two different identifiers on iOS.
			// On Android, where they are both equal and represent the event id, also strings.
			// when { action: 'CANCELED' } is returned, the dialog was dismissed
			console.log('hey we made it?', event);
			console.warn(JSON.stringify(eventInfo));
		})
		.catch((error: string) => {
			// handle error such as when user rejected permissions
			console.warn(error);
		});

export default addToPersonalCalendar;
