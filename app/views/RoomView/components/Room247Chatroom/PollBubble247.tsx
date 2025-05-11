import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PollBubble247 = ({ blocks, creator, timestamp }: any) => {
	// Find poll title (first section block without a button accessory)
	const titleBlock = blocks.find((b: any) => b.type === 'section' && b.text?.text && !b.accessory?.type);
	const title = titleBlock?.text?.text || 'Poll';

	// Find all option blocks (section with button accessory)
	const optionBlocks = blocks.filter((b: any) => b.type === 'section' && b.accessory?.type === 'button');
	// Find all context blocks (results and voters)
	const contextBlocks = blocks.filter((b: any) => b.type === 'context');

	// For each option, find the next context block with a percentage after the option block
	function findResultForOption(optionIdx: number) {
		// Find the index of this option block in the original blocks array
		const optionBlock = optionBlocks[optionIdx];
		const optionBlockIdx = blocks.indexOf(optionBlock);
		// Look forward for the next context block with a percentage
		for (let i = optionBlockIdx + 1; i < blocks.length; i++) {
			const b = blocks[i];
			if (b.type === 'context' && b.elements?.[0]?.text) {
				const text = b.elements[0].text;
				// If it's a summary block, skip
				if (/votes? -/i.test(text)) continue;
				// If it matches a percentage, return the percentage
				const match = text.match(/([0-9.]+% \([0-9]+\))/);
				if (match) return match[1];
			}
			// Stop if we hit another section (next option)
			if (b.type === 'section' && b.accessory?.type === 'button' && b !== optionBlock) break;
		}
		return '';
	}

	const options = optionBlocks.map((option: any, i: number) => {
		return {
			text: option.text.text,
			button: option.accessory,
			result: findResultForOption(i)
		};
	});

	// Find the summary voters blocks (context blocks with 'votes -')
	const votersSummaryBlocks = contextBlocks
		.map((block: any) => block.elements?.[0]?.text)
		.filter((text: string | undefined) => text && /votes? -/i.test(text));

	// Parse and aggregate
	let totalVotes = 0;
	let allNames: string[] = [];
	votersSummaryBlocks.forEach((text: string) => {
		// Example: "2 votes - Alice Bob"
		const match = text.match(/^([0-9]+) votes? - (.+)$/i);
		if (match) {
			totalVotes += parseInt(match[1], 10);
			// Split names by space, comma, or both (adjust as needed)
			allNames.push(...match[2].split(/[, ]+/).filter(Boolean));
		}
	});
	// Remove duplicates and empty strings
	allNames = Array.from(new Set(allNames)).filter(Boolean);

	let votersSummary = '';
	if (totalVotes > 0 && allNames.length > 0) {
		votersSummary = `${totalVotes} votes - ${allNames.join(', ')}`;
	} else {
		votersSummary = `${totalVotes} votes`;
	}

	return (
		<View style={styles.bubble}>
			<Text style={styles.creator}>{creator?.username || 'Poll Creator'}</Text>
			<Text style={styles.title}>{title}</Text>
			{options.map((opt: any, idx: number) => (
				<View key={idx} style={styles.optionRow}>
					<TouchableOpacity style={styles.optionButton}>
						<Text style={styles.optionText}>{opt.text}</Text>
					</TouchableOpacity>
					{opt.result && <Text style={styles.result}>{opt.result}</Text>}
				</View>
			))}
			{votersSummary ? <Text style={styles.voters}>{votersSummary}</Text> : null}
			<Text style={styles.timestamp}>{timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	bubble: {
		backgroundColor: 'white',
		borderRadius: 16,
		padding: 12,
		marginVertical: 4,
		minWidth: 200,
		maxWidth: '90%',
		alignSelf: 'flex-start',
		// WhatsApp-like shadow
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2
	},
	creator: { fontWeight: 'bold', marginBottom: 4 },
	title: { fontSize: 16, marginBottom: 8 },
	optionRow: { marginBottom: 16 },
	optionButton: {
		backgroundColor: '#1E2A3A', // dark navy
		borderRadius: 999,
		paddingVertical: 8,
		paddingHorizontal: 24,
		marginBottom: 2
	},
	optionText: { color: 'white', fontWeight: 'bold' },
	result: { color: '#888', fontSize: 12, marginTop: 2, marginBottom: 8 },
	voters: { color: '#888', fontSize: 12, marginTop: 2 },
	timestamp: { fontSize: 12, color: '#888', marginTop: 8, alignSelf: 'flex-end' }
});

export default PollBubble247;
