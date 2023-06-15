import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import * as HeaderButton from '../../../containers/HeaderButton';
import { LISTENER } from '../../../containers/Toast';
import EventEmitter from '../../../lib/methods/helpers/events';
import { themes } from '../../../lib/constants';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import DiscussionCard from './Components/DiscussionCard';

const DiscussionHomeView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<HeaderButton.Drawer navigation={navigation} testID='display-view-drawer' color={themes[theme].superGray} />
				),
				headerRight: () => (
					<HeaderButton.Container>
						<HeaderButton.Item
							iconName='search'
							color={themes[theme].superGray}
							onPress={() => {
								EventEmitter.emit(LISTENER, { message: `Open search` });
							}}
						/>
					</HeaderButton.Container>
				)
			});
		}
	});

	return (
		<View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 20 }}>
			<Text style={{ marginTop: 40 }}>Discussion Card</Text>
			<View style={{ height: 1, width: '100%', backgroundColor: 'gray', marginVertical:10 }} />
			<DiscussionCard />
			<Text style={{ marginTop: 40 }}>Saved Post Card</Text>
			<View style={{ height: 1, width: '100%', backgroundColor: 'gray', marginVertical:10 }} />
			<DiscussionCard />
		</View>
	);
};

export default withTheme(DiscussionHomeView);
