import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IApplicationState } from '../../definitions';
import { hideRemoveEventPopup } from '../../actions/confirmationPopup';
import { deleteEventRequest, deregisterEventRequest } from '../../actions/calendarEvents';
import { getUserSelector } from '../../selectors/login';

const RemoveEventPopup = ({ eventId, attendeeId }: { eventId: string; attendeeId: string }) => {
	const dispatch = useDispatch();
	const navigation = useNavigation<StackNavigationProp<any>>();

	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const isAdmin = user?.roles && user?.roles.includes('admin');

	const handleRemove = () => {
		console.log(eventId, attendeeId);
		if (isAdmin) {
			dispatch(deleteEventRequest(eventId));
		} else {
			dispatch(deregisterEventRequest(eventId, attendeeId));
		}
		dispatch(hideRemoveEventPopup());
		navigation.goBack();
	};

	const handleDismiss = () => {
		dispatch(hideRemoveEventPopup());
	};

	return (
		<Modal transparent={true} onRequestClose={handleDismiss}>
			<TouchableWithoutFeedback onPress={handleDismiss}>
				<View style={styles.fullScreen}>
					<View style={styles.popup}>
						<View style={styles.contentContainer}>
							<Text style={styles.title}>Are you sure you want to remove this event from the calendar?</Text>
						</View>
						<TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
							<Text style={styles.removeButtonText}>Remove event</Text>
						</TouchableOpacity>
						<View style={styles.buttonSeparator} />
						<TouchableOpacity style={styles.cancelButton} onPress={handleDismiss}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	fullScreen: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.4)'
	},
	popup: {
		width: '90%',
		backgroundColor: 'white',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		paddingTop: 20,
		alignItems: 'center'
	},
	contentContainer: {
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 20
	},
	title: {
		fontSize: 13,
		textAlign: 'center',
		color: '#3C3C4399'
	},
	removeButton: {
		width: '100%',
		paddingVertical: 12,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: '#CCCCCC'
	},
	removeButtonText: {
		color: 'red',
		textAlign: 'center',
		fontSize: 17,
		fontWeight: '600'
	},
	buttonSeparator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#CCCCCC',
		width: '100%'
	},
	cancelButton: {
		width: '100%',
		paddingVertical: 12
	},
	cancelButtonText: {
		color: '#007AFF',
		textAlign: 'center',
		fontSize: 17,
		fontWeight: '400'
	}
});

export default RemoveEventPopup;
