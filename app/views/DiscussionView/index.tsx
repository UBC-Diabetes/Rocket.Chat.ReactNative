import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { withTheme } from '../../theme';

const DiscussionView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();

	useEffect(() => {
		navigation.setOptions({ title: 'DiscussionView' });
	});

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>DiscussionView</Text>
		</View>
	);
};

export default withTheme(DiscussionView);
