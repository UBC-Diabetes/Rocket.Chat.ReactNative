import React, { useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import * as HeaderButton from '../../../containers/HeaderButton';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import { themes } from '../../../lib/constants';
import styles from './styles';
import { searchItemProps } from './interfaces';

const leftArrow = require('../../../static/images/discussionboard/arrow_left.png');
const rightArrow = require('../../../static/images/discussionboard/arrow_right.png');

const searchData = [
	{
		title: 'Exercising with a watch?',
		description: 'Anyone have experience with exercising with a watch on a daily basis to track your levels?'
	},
	{
		title: 'Thoughts on Exercising with TD1?'
	},
	{
		title: 'Exercising on an empty stomach?'
	},
	{
		title: 'Travelling advice',
		description: 'I exercise a lot during travel andwonder if anyone has any tips'
	},
	{
		title: 'My terrible experience with exercising while on a specific diet.'
	}
];

const SearchView = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();

	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();
	const [searchText, setSearchText] = React.useState('');
	const [filteredData, setFilteredData] = React.useState([]);

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
						<Image source={leftArrow} style={{ width: 11, height: 19 }} resizeMode='contain' />
					</TouchableOpacity>
				)
			});
		}
	});

	const searchItem = ({ item, index }: searchItemProps) => (
		<TouchableOpacity style={styles.searchItemContainer} key={index} onPress={() => navigation.navigate('DiscussionPostView')}>
			<Text style={styles.title}>{item.title}</Text>
			{item.description && <Text style={styles.description}>{item.description}</Text>}
			<View style={styles.searchItemArrow}>
				<Image source={rightArrow} style={styles.arrow} resizeMode='contain' />
			</View>
		</TouchableOpacity>
	);
	useEffect(() => {
		let filteredData = [];
		if (searchText.length === 0 || searchText === '') {
			setFilteredData([]);
		} else {
			filteredData = searchData.filter(
				item =>
					item?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
					item?.title?.toLowerCase().includes(searchText.toLowerCase())
			);

			setFilteredData(filteredData);
		}
	}, [searchText]);

	return (
		<View style={styles.mainContainer}>
			<View style={styles.searchContainer}>
				<TextInput
					placeholder='Search...'
					style={styles.textInput}
					multiline
					maxLength={150}
					value={searchText}
					onChangeText={text => setSearchText(text)}
				/>
				<HeaderButton.Item iconName='search' color={themes[theme].superGray} />
			</View>
			<FlatList
				data={filteredData}
				renderItem={searchItem}
				style={{ marginHorizontal: 20 }}
				ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
				ListFooterComponent={() => <View style={{ height: 40 }} />}
			/>
		</View>
	);
};

export default withTheme(SearchView);
