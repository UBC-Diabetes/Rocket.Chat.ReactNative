import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import * as HeaderButton from '../../../containers/HeaderButton';
import { themes } from '../../../lib/constants';
import { useTheme, withTheme } from '../../../theme';
import styles from './styles';
import { IApplicationState } from '../../../definitions';
import PostCard from '../Components/DiscussionPostCard';
import { posts } from '../data';
import { getIcon } from '../helpers';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

const DiscussionView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();

	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<TouchableOpacity
						style={{ marginLeft: 20 }}
						onPress={() => {
							navigation.goBack();
						}}
						hitSlop={hitSlop}
					>
						<Image source={getIcon('arrowLeft')} style={{ width: 11, height: 19 }} resizeMode='contain' />
					</TouchableOpacity>
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

	return (
		<View style={styles.mainContainer}>
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>Exercising</Text>
			</View>
			<FlatList
				data={posts}
				renderItem={({ item }) => <PostCard {...item} onPress={() => navigation.navigate('DiscussionPostView')} />}
				keyExtractor={(item, id) => item.title + id}
				ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
				style={{ paddingHorizontal: 20, paddingTop: 10 }}
				ListFooterComponent={<View style={styles.footer} />}
			/>
			<TouchableOpacity
				style={[styles.buttonContainer, { backgroundColor: themes[theme].mossGreen }]}
				onPress={() => {
					navigation.navigate('DiscussionNewPostView');
				}}
			>
				<Text style={styles.buttonText}>Create a post</Text>
			</TouchableOpacity>
		</View>
	);
};

export default withTheme(DiscussionView);
