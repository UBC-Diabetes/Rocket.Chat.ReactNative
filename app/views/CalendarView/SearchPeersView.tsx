import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useLoadPeers } from './helpers';
import Avatar from '../../containers/Avatar';
import SearchBox from '../../containers/SearchBox';
import StatusBar from '../../containers/StatusBar';
import { useTheme } from '../../theme';

export interface IUser {
	user: {
		id: string;
		token: string;
	};
}

const SearchPeersView = () => {
	const theme = useTheme();
	const { colors } = theme;
	const navigation = useNavigation<StackNavigationProp<any>>();
	const { data, loading, loadPeers, updateSearchText } = useLoadPeers();
	const [selectedPeers, setSelectedPeers] = useState<Set<string>>(new Set());

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		loadPeers({});
	}, []);

	const onSearchChangeText = (text: string) => {
		updateSearchText(text);
	};

	const togglePeerSelection = (peerId: string) => {
		setSelectedPeers(prev => {
			const newSet = new Set(prev);
			if (newSet.has(peerId)) {
				newSet.delete(peerId);
			} else {
				newSet.add(peerId);
			}
			return newSet;
		});
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity style={styles.peerItem} onPress={() => togglePeerSelection(item._id)}>
			<View style={styles.peerInfo}>
				<Avatar text={item.username} size={36} borderRadius={18} />
				<Text style={styles.peerName}>{item.username}</Text>
			</View>
			{selectedPeers.has(item._id) && (
				<View style={styles.checkMark}>
					<Text style={styles.checkMarkText}>✓</Text>
				</View>
			)}
		</TouchableOpacity>
	);

	const handleLoadMore = useCallback(() => {
		if (!loading) {
			loadPeers({});
		}
	}, [loading, loadPeers]);

	if (loading && data.length === 0) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.backgroundColor }]} testID='calendar-view'>
			<StatusBar />
			<SearchBox
				onChangeText={onSearchChangeText}
				onSubmitEditing={() => loadPeers({ newSearch: true })}
				clearText={() => updateSearchText('')}
				testID='federation-view-search'
			/>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={item => item._id}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.5}
				ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} /> : null}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
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
