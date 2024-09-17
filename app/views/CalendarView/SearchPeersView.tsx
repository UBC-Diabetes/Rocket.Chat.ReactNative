import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useLoadPeers } from './helpers';
import Avatar from '../../containers/Avatar';
import SearchBox from '../../containers/SearchBox';
import { useTheme } from '../../theme';
import { createEventDraft } from '../../actions/createEvent';

export interface IUser {
	user: {
		id: string;
		token: string;
	};
}

const SearchPeersView = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const { colors } = theme;
	const navigation = useNavigation<StackNavigationProp<any>>();
	const { data, loading, loadPeers, updateSearchText, text } = useLoadPeers();
	const [selectedPeers, setSelectedPeers] = useState<Set<string>>(new Set());

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		loadPeers({});
	}, []);

	const onSearchChangeText = (newText: string) => {
		updateSearchText(newText);
	};

	const clearSearch = useCallback(() => {
		updateSearchText('');
	}, [updateSearchText]);

	const handleLoadMore = useCallback(() => {
		if (!loading && text === '') {
			loadPeers({});
		}
	}, [loading, loadPeers, text]);

	const togglePeerSelection = (username: string) => {
		setSelectedPeers(prev => {
			const newSet = new Set(prev);
			if (newSet.has(username)) {
				newSet.delete(username);
			} else {
				newSet.add(username);
			}

			dispatch(createEventDraft({ peers: Array.from(newSet) }));
			return newSet;
		});
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity style={styles.peerItem} onPress={() => togglePeerSelection(item.username)}>
			<View style={styles.peerInfo}>
				<Avatar text={item.username} size={36} borderRadius={18} />
				<Text style={styles.peerName}>{item.username}</Text>
			</View>
			{selectedPeers.has(item.username) && (
				<View style={styles.checkMark}>
					<Text style={styles.checkMarkText}>✓</Text>
				</View>
			)}
		</TouchableOpacity>
	);

	const handleDone = () => {
		console.log('Done pressed, selected peers:', Array.from(selectedPeers));
		navigation.goBack();
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.backgroundColor }]} testID='calendar-view'>
			<View style={styles.headerContainer}>
				<View style={styles.searchContainer}>
					<SearchBox
						onChangeText={onSearchChangeText}
						clearText={clearSearch}
						testID='federation-view-search'
						value={text}
						placeholder='Add guests'
					/>
				</View>
				<TouchableOpacity style={styles.doneButton} onPress={handleDone}>
					<Text style={styles.doneButtonText}>Done</Text>
				</TouchableOpacity>
			</View>
			{loading && data.length === 0 ? (
				<View style={styles.centerContent}>
					<ActivityIndicator size='large' color={colors.primary} />
				</View>
			) : (
				<FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={item => item.username}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} /> : null}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10
	},
	doneButton: {
		padding: 10,
		alignItems: 'center',
		marginBottom: 15
	},
	doneButtonText: {
		color: '#ff69b4',
		fontSize: 16
	},
	searchContainer: {
		flex: 1,
		marginRight: 10
	},
	searchSpinner: {},
	container: {
		flex: 1
	},
	centerContent: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	peerItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0'
	},
	peerInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	peerName: {
		fontSize: 16,
		marginLeft: 10
	},
	checkMark: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#F5F4F2',
		justifyContent: 'center',
		alignItems: 'center'
	},
	checkMarkText: {
		color: '#000000',
		fontSize: 16
	}
});

export default SearchPeersView;
