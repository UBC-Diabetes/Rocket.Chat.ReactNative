import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';

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
			<View style={styles.buttonContainer}>
				<Button title='Add Peers' onPress={() => console.log('Add Peers')} color='#CB007B' />
			</View>
			<View style={styles.buttonContainer}>
				<Button title='Create Event' onPress={() => console.log('Create Event')} color='#4CAF50' />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 20
	},
	input: {
		height: 40,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10
	},
	textArea: {
		height: 100
	},
	buttonContainer: {
		marginBottom: 10
	}
});

export default CreateEventScreen;
