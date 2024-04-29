import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';

import { useTheme } from '../../theme';

const CalendarView = (): React.ReactElement => {
	const { colors } = useTheme();

  const [selected, setSelected] = useState('');

  return (
    <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
    />
  );
}

export default CalendarView;
