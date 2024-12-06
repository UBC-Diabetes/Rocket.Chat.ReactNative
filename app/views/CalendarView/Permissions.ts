import { Alert, NativeModules, Platform } from 'react-native';

import * as AddCalendarEvent from 'react-native-add-calendar-event';

import * as Permissions from 'react-native-permissions';
import { addHours, parseISO } from 'date-fns';

interface IEventConfig {
	title: string;
	startDate: string; //  'YYYY-MM-DDTHH:mm:ss.SSSZ'
	endDate: string;
	location: string;
	allDay: boolean;
	url?: string; // iOS only
	notes: string; // The notes (iOS) or description (Android) associated with the event.
	navigationBarIOS?: {
		tintColor: string;
		barTintColor: string;
		backgroundColor: string;
		translucent: boolean;
		titleColor: string;
	};
}

const addToPersonalCalendar = event =>
	Permissions.request(
		Platform.select({
			ios: Permissions.PERMISSIONS.IOS.CALENDARS_WRITE_ONLY,
			android: Permissions.PERMISSIONS.ANDROID.WRITE_CALENDAR
		})
	)
		.then(writeResult => {
			if (writeResult !== Permissions.RESULTS.GRANTED) {
				return;
			}

			const eventStartDate = parseISO(event.dateTime);
			const eventEndDate = addHours(eventStartDate, 1);

			if (Platform.OS === 'ios') {
				const eventConfig = {
					title: event.title,
					startDate: new Date(eventStartDate).toISOString(),
					endDate: new Date(eventEndDate).toISOString(),
					location: event.meetingLink,
					allDay: false,
					notes: event.description
				};
				return AddCalendarEvent.presentEventCreatingDialog(eventConfig);
			}

			// Android path with read permission
			return Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_CALENDAR).then(readResult => {
				if (readResult !== Permissions.RESULTS.GRANTED) {
					return;
				}
				const eventConfig = {
					title: event.title,
					notes: event.description,
					location: event.meetingLink,
					startTime: new Date(eventStartDate).getTime(),
					endTime: new Date(eventEndDate).getTime()
				};
				return NativeModules.CalendarModule.addEvent(eventConfig);
			});
		})
		.then(result => {
			if (!result) return;

			if (Platform.OS === 'ios') {
				// iOS already shows the calendar app
				console.log('Event handled by iOS:', result);
			} else {
				// Show Android sync delay message
				Alert.alert('Event Added', 'Event has been added to your calendar. It may take a minute to appear.', [{ text: 'OK' }]);
			}
		})
		.catch(error => {
			console.error('Calendar error:', error);
			Alert.alert('Error', 'Failed to add event to calendar. Please try again.', [{ text: 'OK' }]);
		});

export default addToPersonalCalendar;
