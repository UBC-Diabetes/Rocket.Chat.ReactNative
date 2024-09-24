import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as HeaderButton from '../../containers/HeaderButton';

import { useDispatch, useSelector } from 'react-redux';

import { createEventDraft } from '../../actions/calendarEvents';
import { getUserSelector } from '../../selectors/login';
import { getEventSelector } from '../../selectors/event';
import { IApplicationState } from '../../definitions';
import Avatar from '../../containers/Avatar';
import { createCalendarEvent } from '../../lib/services/restApi';

const CreateEventView = () => {
	const [title, setTitle] = useState('');
	const [date, setDate] = useState(new Date());
	const [time, setTime] = useState(new Date());
	const [description, setDescription] = useState('');
	const [meetingLink, setMeetingLink] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const dispatch = useDispatch();
	const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const draftEvent = useSelector((state: IApplicationState) => getEventSelector(state));
	const userName = user?.username || '';

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
		if (!draftEvent?.time) {
			const defaultEvent = {
				time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				description: draftEvent?.description ?? 'Event description',
				title: draftEvent?.title ?? 'Event title',
				date: draftEvent?.date ?? date,
				peers: draftEvent?.peers ?? [],
				attendees: draftEvent?.attendees ?? []
			};
			dispatch(createEventDraft(defaultEvent));
		}
	}, []);

	const onTitleChange = (title: string) => {
		setTitle(title);
		dispatch(createEventDraft({ title }));
	};
	const onDescriptionChange = (description: string) => {
		setDescription(description);
		dispatch(createEventDraft({ description }));
	};
	const onMeetingLinkChange = (meetingLink: string) => {
		setMeetingLink(meetingLink);
		dispatch(createEventDraft({ meetingLink }));
	};
	const onDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShowDatePicker(false);
		setDate(currentDate);
		dispatch(createEventDraft({ date: currentDate }));
	};
	const onTimeChange = (event, selectedTime) => {
		const currentTime = selectedTime || time;
		setShowTimePicker(false);
		setTime(currentTime);
		dispatch(createEventDraft({ time: currentTime }));
	};

	const removePeer = (username: string) => {
		const newPeers = draftEvent?.peers?.filter(peer => peer.username !== username);
		dispatch(createEventDraft({ peers: newPeers }));
	};

	const createEvent = async () => {
		await createCalendarEvent();
		navigation.goBack();
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Create Event</Text>

			<Text style={styles.label}>Title</Text>
			<TextInput style={styles.input} value={title} onChangeText={onTitleChange} placeholder='Enter event title' />

			<View style={styles.rowContainer}>
				<Text style={styles.label}>Date</Text>
				<TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
					<Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
				</TouchableOpacity>
			</View>
			{showDatePicker && <DateTimePicker value={date} mode='date' display='default' onChange={onDateChange} />}

			<View style={styles.rowContainer}>
				<Text style={styles.label}>Time</Text>
				<TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
					<Text style={styles.dateTimeText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
				</TouchableOpacity>
			</View>

			{showTimePicker && <DateTimePicker value={time} mode='time' is24Hour={true} display='default' onChange={onTimeChange} />}

			<Text style={styles.label}>Description</Text>
			<TextInput
				style={[styles.input, styles.textArea]}
				placeholder='Describe your event'
				value={description}
				onChangeText={onDescriptionChange}
				multiline
				numberOfLines={4}
			/>

			<Text style={styles.label}>Zoom Link</Text>
			<TextInput style={styles.input} placeholder='Enter Meeting link' value={meetingLink} onChangeText={onMeetingLinkChange} />

			<View style={styles.rowContainer}>
				<Text style={styles.sectionTitle}>Peer Supporters</Text>
				<TouchableOpacity style={styles.addPeersButton} onPress={() => navigation.navigate('SearchPeersView')}>
					<Text style={styles.addPeersButtonText}>Add Peers</Text>
				</TouchableOpacity>
			</View>

			{draftEvent?.peers?.map((peer, index) => (
				<View key={index} style={styles.peerItem}>
					<Avatar text={peer.username} size={36} borderRadius={18} />
					<Text style={styles.peerName}>{peer.username}</Text>
					<TouchableOpacity onPress={() => removePeer(peer.username)} style={styles.removePeerButton}>
						<Text style={styles.removePeerButtonText}>x</Text>
					</TouchableOpacity>
				</View>
			))}

			<TouchableOpacity style={styles.createEventButton} onPress={() => createEvent()}>
				<Text style={styles.createEventButtonText}>Create Event</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff'
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
	textArea: {
		height: 100,
		textAlignVertical: 'top'
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
	dateTimeButton: {
		borderRadius: 8,
		padding: 12,
		minWidth: 150,
		alignItems: 'flex-end'
	},
	dateTimeText: {
		fontWeight: 'bold'
	},
	sectionTitle: {
		fontSize: 18,
		marginTop: 20,
		marginBottom: 10
	},
	addPeersButton: {
		borderWidth: 1,
		borderColor: '#ff69b4',
		borderRadius: 25,
		padding: 10,
		alignItems: 'center',
		marginBottom: 15
	},
	addPeersButtonText: {
		color: '#ff69b4',
		fontSize: 16
	},
	peerItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10
	},
	peerName: {
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

export default CreateEventView;
