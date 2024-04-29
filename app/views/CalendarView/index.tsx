import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Touchable from 'react-native-platform-touchable';
import { useSelector } from 'react-redux';

import { getUserSelector } from '../../selectors/login';
import { IApplicationState } from '../../definitions';

import { useTheme } from '../../theme';
import StatusBar from '../../containers/StatusBar';
import Avatar from '../../containers/Avatar';
import * as HeaderButton from '../../containers/HeaderButton';

const CalendarView = (): React.ReactElement => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const userName = user?.username || '';

  const [selected, setSelected] = useState('');
	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
			navigation.setOptions({
				headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='calendar-view-drawer' />,
		headerRight: () => (
					<HeaderButton.Container>
						<Touchable style={{ marginRight: 20 }} onPress={() => navigation.navigate('ProfileView')}>
							{userName ? (
								<Avatar text={userName} size={24} borderRadius={12} />
							) : (
								<></>
							)}
						</Touchable>
					</HeaderButton.Container>
				)

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
