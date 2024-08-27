import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const CreateEventScreen = () => {
	const [title, setTitle] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [description, setDescription] = useState('');
	const [zoomLink, setZoomLink] = useState('');

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Create Event</Text>
			<TextInput placeholder='Title' value={title} onChangeText={setTitle} style={styles.input} />
			<TextInput placeholder='Date' value={date} onChangeText={setDate} style={styles.input} />
			<TextInput placeholder='Time' value={time} onChangeText={setTime} style={styles.input} />
			<TextInput
				placeholder='Description'
				value={description}
				onChangeText={setDescription}
				multiline
				numberOfLines={4}
				style={[styles.input, styles.textArea]}
			/>
			<TextInput placeholder='Enter Zoom link' value={zoomLink} onChangeText={setZoomLink} style={styles.input} />
			<TouchableOpacity style={styles.peerButton}>
				<Text style={styles.peerButtonText}>Add Peers</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.createButton}>
				<Text style={styles.createButtonText}>Create Event</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: '#f4f4f4' // Light gray background
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center'
	},
	input: {
		height: 50,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5, // Rounded corners for inputs
		backgroundColor: '#fff' // White background for input fields
	},
	textArea: {
		height: 100 // Larger input area for the description
	},
	peerButton: {
		backgroundColor: '#CB007B', // Bright pink color
		padding: 15,
		borderRadius: 25, // Fully rounded button edges
		alignItems: 'center',
		marginBottom: 10
	},
	peerButtonText: {
		color: '#ffffff', // White text
		fontSize: 16
	},
	createButton: {
		backgroundColor: '#4CAF50', // Moss green color
		padding: 15,
		borderRadius: 25, // Fully rounded button edges
		alignItems: 'center'
	},
	createButtonText: {
		color: '#ffffff', // White text
		fontSize: 16
	}
});

export default CreateEventScreen;
