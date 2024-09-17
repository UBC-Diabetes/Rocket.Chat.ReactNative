import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import isEmpty from 'lodash/isEmpty';
import { format, parseISO } from 'date-fns';

import Avatar from '../../containers/Avatar';

import testIDs from './testIds';

interface ItemProps {
	item: any;
}

const AgendaItem = (props: ItemProps) => {
	const { item } = props;
	const navigation = useNavigation<StackNavigationProp<any>>();

	const itemPressed = useCallback(item => {
		console.log(item);
		navigation.navigate('EventDetailsView');
	}, []);

	if (isEmpty(item)) {
		return (
			<View style={styles.emptyItem}>
				<Text style={styles.emptyItemText}>No Events Planned Today</Text>
			</View>
		);
	}

	const parsedDate = parseISO(item.date ?? '2023-08-20T16:00:00');
	const formattedDate = format(parsedDate, "EEEE 'at' h:mm a");
	const fullTitle = `${item.title}${item.isZoom ? ' (Zoom)' : ''}`;

	return (
		<View style={styles.itemContainer}>
			<TouchableOpacity onPress={() => itemPressed(item)} style={styles.item} testID={testIDs.agenda.ITEM}>
				<View style={styles.contentContainer}>
					<Text style={styles.itemTitleText}>{fullTitle}</Text>
					<Text style={styles.itemDateText}>{formattedDate}</Text>
				</View>
				<View style={styles.avatarContainer}>
					{item.users.map((user, index) => (
						<View key={user.username} style={[styles.avatarWrapper, { zIndex: item.users.length - index, right: index * 15 }]}>
							<Avatar text={user.username} size={36} borderRadius={18} />
						</View>
					))}
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
	avatarContainer: {
		flexDirection: 'row-reverse',
		marginLeft: 10
	},
	avatarWrapper: {
		position: 'relative',
		marginLeft: -1
	},
	itemContainer: {
		paddingBottom: 8,
		backgroundColor: '#F5F4F2'
	},
	item: {
		padding: 20,
		backgroundColor: 'white',
		flexDirection: 'row',

		borderRadius: 20,
		left: 15,
		width: '90%'
	},
	contentContainer: {
		flex: 1
	},
	itemTitleText: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 16
	},
	itemDateText: {
		color: 'grey',
		fontSize: 14,
		marginTop: 4
	},
	itemButtonContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	emptyItem: {
		paddingLeft: 20,
		height: 52,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'lightgrey'
	},
	emptyItemText: {
		color: 'lightgrey',
		fontSize: 14
	}
});
