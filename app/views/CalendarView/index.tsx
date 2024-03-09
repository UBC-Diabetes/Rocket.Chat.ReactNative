import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import {
	//  useTheme,
	withTheme
} from '../../theme';


const CalendarView: React.FC = () => {
    return (
		<View testID='calendar-view'>
		</View>
	);
}

export default withTheme(CalendarView);
