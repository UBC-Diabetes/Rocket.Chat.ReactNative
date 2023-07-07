import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import * as HeaderButton from '../../../containers/HeaderButton';
import { themes } from '../../../lib/constants';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import DiscussionBoardCard from '../Components/DiscussionCardBoard';
import DiscussionPostCard from '../Components/DiscussionPostCard';
import Header from '../Components/Header';
import { DiscussionTabs } from './interaces';
import styles from './styles';
import { discussionBoardData, posts } from '../data';

const DiscussionHomeView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const [selectedTab, setSelectedTab] = useState(DiscussionTabs.DISCUSSION_BOARDS);
	const { theme } = useTheme();

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<View style={{ marginLeft: 8 }}>
						<HeaderButton.Drawer navigation={navigation} testID='display-view-drawer' color={themes[theme].superGray} />
					</View>
				),
				headerRight: () => (
					<View style={{ marginRight: 8 }}>
						<HeaderButton.Container>
							<HeaderButton.Item
								iconName='search'
								color={themes[theme].superGray}
								onPress={() => navigation.navigate('DiscussionSearchView')}
							/>
						</HeaderButton.Container>
					</View>
				)
			});
		}
	});

	const content = () => (
		<View style={{ width: '100%' }}>
			{selectedTab === DiscussionTabs.DISCUSSION_BOARDS && (
				<FlatList
					data={discussionBoardData}
					renderItem={({ item }) => <DiscussionBoardCard {...item} onPress={() => navigation.navigate('DiscussionBoardView')} />}
					keyExtractor={(item, id) => item.title + id}
					ItemSeparatorComponent={() => <View style={styles.discussionBoardsSeparator} />}
					style={{ padding: 20 }}
					ListFooterComponent={<View style={styles.footer} />}
				/>
			)}
			{selectedTab === DiscussionTabs.SAVED_POSTS && (
				<FlatList
					data={posts}
					renderItem={({ item }) => <DiscussionPostCard {...item} />}
					keyExtractor={(item, id) => item.title + id}
					ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
					style={{ padding: 20 }}
					ListFooterComponent={<View style={styles.footer} />}
				/>
			)}
		</View>
	);

	return (
		<View style={styles.mainContainer}>
			<Header onTabChange={(tab: DiscussionTabs) => setSelectedTab(tab)} />
			{content()}
		</View>
	);
};

export default withTheme(DiscussionHomeView);
