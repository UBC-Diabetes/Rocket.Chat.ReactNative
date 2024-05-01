import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Touchable from 'react-native-platform-touchable';
import { useSelector } from 'react-redux';

import { useTheme } from '../../theme';
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

	const theme = useTheme();
	const { colors } = theme;
	const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const userName = user?.username || '';

	const marked = useRef(getMarkedDates());

	const styles = makeStyles(theme);
	const todayBtnTheme = { current: colors.buttonBackground };

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

	const renderItem = useCallback(({ item }: any) => <AgendaItem item={item} />, []);

	return (
		<ScrollView style={{ flex: 1, padding: 20, backgroundColor: colors.backgroundColor }} testID='calendar-view'>
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
						// theme={theme.current}
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
					// sectionStyle={styles.section}
					// dayFormat={'yyyy-MM-d'}
				/>
			</CalendarProvider>
		</ScrollView>
	);
};

const makeStyles = (theme: any) => {
	return StyleSheet.create({
		title: {
			color: theme.colors.titleText,
			marginBottom: 10,
			fontSize: 24,
			lineHeight: 29,
			fontWeight: '600'
		},
		tileContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap'
		}
	});
};

export default CalendarView;
