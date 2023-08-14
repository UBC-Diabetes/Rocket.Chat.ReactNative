import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Q } from '@nozbe/watermelondb';
import { useDebounce } from 'use-debounce';

import database from '../../../lib/database';
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
	// const { theme } = useTheme();
	const theme = 'light';

	const [searchText, setSearchText] = useState('');
	const [debounceValue] = useDebounce(searchText, 1000);
	const [filteredData, setFilteredData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

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

	const searchItem = ({ item, index }: searchItemProps) => {
		console.log('item', item);
		console.log('item?._raw?.msg', item?._raw?.msg);
		const formattedItem = { ...item };

		try {
			if (item?._raw?.u?.length && item._raw.u.length > 0 && item._raw.u !== '[]') {
				formattedItem._raw.u = JSON.parse(item._raw.u);
			}
			if (item?._raw?.attachments?.length && item._raw.attachments.length > 0) {
				formattedItem._raw.attachments = JSON.parse(item._raw.attachments);
			}
			if (item?._raw?.replies?.length && item._raw.replies.length > 0 && item._raw.replies !== '[]') {
				formattedItem._raw.replies = JSON.parse(item._raw.replies);
			}
			if (item?._raw?.reactions?.length && item._raw.reactions.length > 0 && item._raw.reactions !== '[]') {
				formattedItem._raw.reactions = JSON.parse(item._raw.reactions);
			}
		} catch (error) {}

		let title = null;
		let description = item?._raw?.msg || null;

		console.log('formattedItem', formattedItem);

		return (
			<TouchableOpacity
				style={styles.searchItemContainer}
				key={index}
				onPress={() => navigation.navigate('DiscussionPostView', { item: formattedItem })}
			>
				{title && <Text style={styles.title}>{title}</Text>}
				{description && <Text style={styles.description}>{description}</Text>}
				<View style={styles.searchItemArrow}>
					<Image source={rightArrow} style={styles.arrow} resizeMode='contain' />
				</View>
			</TouchableOpacity>
		);
	};

	const search = () => {
		console.log('Searching ');

		const db = database.active;

		setIsLoading(true);
		try {
			const messagesObservable = db
				.get('messages')
				.query(
					// Q.or(Q.where('starred', true), Q.where('anotherField', 'someValue')),
					Q.where('msg', Q.like(`%${searchText}%`)),
					Q.experimentalSortBy('ts', Q.desc),
					Q.experimentalSkip(0)
				)
				.observe();

			console.log('messagesObservable', messagesObservable);

			messagesObservable.subscribe((data: any) => {
				console.log('posts ----------', data);
				setFilteredData(data);
			});
		} catch {}
		setIsLoading(false);
	};

	useEffect(() => {
		if (searchText.length === 0 || searchText === '') {
			setFilteredData([]);
		} else {
			search();
		}
	}, [debounceValue]);

	console.log('searchText =======> ', searchText);
	console.log('isloading =======> ', isLoading);

	return (
		<View style={styles.mainContainer}>
			{isLoading && <ActivityIndicator size='large' color={themes[theme].auxiliaryText} />}
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
