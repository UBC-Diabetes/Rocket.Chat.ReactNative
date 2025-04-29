
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { withTheme } from '../../../../theme';
import styles from './styles';
import { themes } from '../../../../lib/constants';

interface IRoom247ListProps {
  theme: string;
  messages: any[];
  renderItem: (item: any, prevItem: any) => React.ReactElement;
  loading: boolean;
}

const Room247List = ({ theme, messages, renderItem, loading }: IRoom247ListProps) => {
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themes[theme].backgroundColor }]}>
        <Text style={{ color: themes[theme].auxiliaryText }}>Loading messages...</Text>
      </View>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: themes[theme].backgroundColor }]}>
        <Text style={{ color: themes[theme].auxiliaryText }}>No messages yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => {
        const prevItem = index > 0 ? messages[index - 1] : null;
        return renderItem(item, prevItem);
      }}
      style={[styles.messageList, { backgroundColor: themes[theme].backgroundColor }]}
      inverted
    />
  );
};

export default withTheme(Room247List);
