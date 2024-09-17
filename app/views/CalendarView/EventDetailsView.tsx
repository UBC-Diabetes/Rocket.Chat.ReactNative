import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as HeaderButton from '../../containers/HeaderButton';
import { getUserSelector } from '../../selectors/login';
import { getEventSelector } from '../../selectors/event';
import { IApplicationState } from '../../definitions';
import Avatar from '../../containers/Avatar';
import { CustomIcon } from '../../containers/CustomIcon';

const EventDetailsView = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const { title, date, time, description, zoomLink, peers, numGuests } = useSelector((state: IApplicationState) =>
		getEventSelector(state)
	);
	const userName = user?.username || '';

	// const isRegistered = guests.contains(userName)

	console.log(numGuests);

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		navigation.setOptions({
			headerRight: () => (
				<HeaderButton.Container>
					<Touchable style={{ marginRight: 20 }} onPress={() => navigation.navigate('ProfileView')}>
						{userName ? <Avatar text={userName} size={24} borderRadius={12} /> : <></>}
					</Touchable>
				</HeaderButton.Container>
			)
		});
	});

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.headerTitle}>{title}</Text>

			<Text style={styles.dateTimeText}>
				{new Date(date ?? '').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {time}
			</Text>

			<Text style={styles.guests}>{numGuests || 0} guests</Text>

			<Text style={styles.description}>{description}</Text>

			<View style={styles.zoomContainer}>
				<Text style={styles.label}>Zoom Link</Text>
				<Text>{zoomLink}</Text>
			</View>
			<View style={{ height: 1, backgroundColor: '#E3E3E3', width: '100%', marginBottom: 24 }} />

			<Text style={styles.sectionTitle}>Peer Supporters</Text>
			{peers?.map((peer, index) => (
				<View key={index} style={styles.peerItem}>
					<View style={styles.peerInfo}>
						<Avatar text={peer} size={36} borderRadius={18} />
						<Text style={styles.peerName}>{peer}</Text>
					</View>
					<View style={styles.iconContainer}>
						<TouchableOpacity style={styles.iconButton}>
							<CustomIcon name='user' size={25} color='#000' />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.iconButton, { marginLeft: 10 }]}>
							<CustomIcon name='message' size={25} color='#000' />
						</TouchableOpacity>
					</View>
				</View>
			))}
			<TouchableOpacity style={styles.createEventButton} onPress={() => 'blah'}>
				<Text style={styles.createEventButtonText}>Register</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	headerTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 8
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff'
	},
	zoomContainer: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
		marginBottom: 24
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center'
	},

	headerText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginLeft: 20
	},
	input: {
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 8,
		padding: 15,
		marginBottom: 15,
		fontSize: 16
	},
	iconButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F5F4F2',
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	label: {
		fontSize: 16,
		marginBottom: 8
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	},
	dateTimeText: {
		fontWeight: '200',
		fontSize: 12,
		color: '#494949',
		marginBottom: 24
	},
	sectionTitle: {
		fontSize: 18,
		marginTop: 20,
		marginBottom: 10
	},
	description: {
		fontSize: 16,
		color: '#666',
		marginBottom: 10
	},
	guests: {
		fontSize: 16,
		fontWeight: '500',
		color: '#000000',
		marginBottom: 24
	},
	peerItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
		paddingHorizontal: 10
	},
	peerInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	iconContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	peerName: {
		marginLeft: 10,
		fontSize: 16
	},
	removePeerButton: {
		backgroundColor: '#F5F4F2',
		borderRadius: 15,
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center'
	},
	removePeerButtonText: {
		color: '#000000',
		fontSize: 16,
		marginBottom: 5
	},
	createEventButton: {
		backgroundColor: '#799A79',
		borderRadius: 25,
		padding: 15,
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 20
	},
	createEventButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold'
	}
});

export default EventDetailsView;
