import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Touchable from 'react-native-platform-touchable';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../theme';
import { createEventDraft } from '../../actions/createEvent';
import { getUserSelector } from '../../selectors/login';
import { IApplicationState } from '../../definitions';
import StatusBar from '../../containers/StatusBar';
import Avatar from '../../containers/Avatar';
import * as HeaderButton from '../../containers/HeaderButton';
import { agendaItems } from './agendaItems';
import AgendaItem from './AgendaItem';
import testIDs from './testIds';
import { getMarkedDates } from './mockedDates';

const CalendarView = (props: any): React.ReactElement => {
	const { weekView } = props;

	const dispatch = useDispatch();
	const theme = useTheme();
	const { colors } = theme;
	const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const userName = user?.username || '';
	const isAdmin = user?.roles && user?.roles.includes('admin');

	const marked = useRef(getMarkedDates());

	const styles = makeStyles(theme);

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		navigation.setOptions({
			headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='calendar-view-drawer' />,
			headerRight: () => (
				<HeaderButton.Container>
					<Touchable style={{ marginRight: 20 }} onPress={() => navigation.navigate('ProfileView')}>
						{userName ? <Avatar text={userName} size={24} borderRadius={12} /> : <></>}
					</Touchable>
				</HeaderButton.Container>
			)
		});
	});

	const createEvent = useCallback(() => {
		dispatch(createEventDraft({ author: userName }));
		navigation.navigate('CreateEventView');
	}, []);

	const renderItem = useCallback(({ item }: any) => <AgendaItem item={item} />, []);

	return (
		<View style={{ flex: 1, backgroundColor: colors.backgroundColor }} testID='calendar-view'>
			<StatusBar />
			<Text style={styles.title}>Calendar</Text>
			<CalendarProvider
				date={agendaItems[1]?.title}
				// onDateChanged={onDateChanged}
				// onMonthChange={onMonthChange}
				showTodayButton
				// disabledOpacity={0.6}
				// theme={todayBtnTheme.current}
				// todayBottomMargin={16}
			>
				{weekView ? (
					<WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current} />
				) : (
					<ExpandableCalendar
						testID={testIDs.expandableCalendar.CONTAINER}
						// horizontal={false}
						// hideArrows
						// disablePan
						// hideKnob
						// initialPosition={ExpandableCalendar.positions.OPEN}
						// calendarStyle={styles.calendar}
						// headerStyle={styles.header} // for horizontal only
						// disableWeekScroll
						theme={{ ...theme, dotColor: '#CB007B', arrowColor: '#CB007B', selectedDayBackgroundColor: '#799A79' }}
						// disableAllTouchEventsForDisabledDays
						firstDay={1}
						markedDates={marked.current}
						// leftArrowImageSource={leftArrowIcon}
						// rightArrowImageSource={rightArrowIcon}
						// animateScroll
						// closeOnDayPress={false}
					/>
				)}
				<AgendaList
					sections={agendaItems}
					renderItem={renderItem}
					// scrollToNextEvent
					sectionStyle={{
						backgroundColor: '#F5F4F2'
					}}
					// dayFormat={'yyyy-MM-d'}
				/>
			</CalendarProvider>
			{isAdmin && (
				<View style={styles.adminButtonContainer}>
					<Touchable style={styles.adminButton} onPress={() => createEvent()}>
						<Text style={styles.adminButtonText}>Create event</Text>
					</Touchable>
				</View>
			)}
		</View>
	);
};

const makeStyles = (theme: any) =>
	StyleSheet.create({
		title: {
			color: theme.colors.titleText,
			marginLeft: 5,
			marginBottom: 10,
			fontSize: 24,
			lineHeight: 29,
			fontWeight: '600'
		},
		tileContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap'
		},
		adminButtonContainer: {
			position: 'absolute',
			bottom: 20,
			width: '100%'
		},
		adminButton: {
			margin: 10,
			backgroundColor: '#799A79',
			paddingVertical: 15,
			paddingHorizontal: 20,
			borderRadius: 20,
			alignItems: 'center',
			justifyContent: 'center'
		},
		adminButtonText: {
			color: 'white',
			fontSize: 20,
			fontWeight: 'bold'
		}
	});

export default CalendarView;
