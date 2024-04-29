import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../theme';
import StatusBar from '../../containers/StatusBar';
import * as HeaderButton from '../../containers/HeaderButton';

const CalendarView = (): React.ReactElement => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<any>>();

  const [selected, setSelected] = useState('');
	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
			navigation.setOptions({
				headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='calendar-view-drawer' />,
			});
	});


  return (

      <ScrollView style={{ flex: 1, padding: 20, backgroundColor: colors.backgroundColor }} testID='calendar-view'>
          <StatusBar />
    <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
    />
          </ScrollView>
  );
}

export default CalendarView;
