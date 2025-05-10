import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import MessageContext from '../../../../containers/message/Context';
import { themes } from '../../../../lib/constants';
import { TSupportedThemes, useTheme } from '../../../../theme';
import MessageAvatar from '../../../../containers/message/MessageAvatar';
import Attachments from '../../../../containers/message/Components/Attachments';
import Markdown from '../../../../containers/markdown';
import { IAttachment, IUser, TGetCustomEmoji } from '../../../../definitions';

interface IRoom247MessageProps {
  id: string;
  msg?: string;
  theme: TSupportedThemes;
  author?: IUser;
  ts: Date | any;
  attachments?: IAttachment[];
  timeFormat?: string;
  isHeader?: boolean;
  getCustomEmoji: TGetCustomEmoji;
  useRealName?: boolean;
  showAttachment?: (file: IAttachment) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  messageContent: {
    flex: 1,
    marginLeft: 8,
  },
  messageContentWithHeader: {
    marginTop: 4,
  },
  messageBox: {
    backgroundColor: '#fff', // White background for received messages
    borderRadius: 8,
    padding: 8,
    marginRight: 40,
    maxWidth: '85%',
  },
  ownMessageBox: {
    backgroundColor: '#dcf8c6', // Light green background for sent messages
    borderRadius: 8,
    padding: 8,
    marginLeft: 40,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#8c8c8c',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  plainText: {
    fontSize: 16,
    color: '#000',
  },
  avatarContainer: {
    width: 36,
  }
});

const Room247Message = ({
  id,
  msg,
  theme,
  author,
  ts,
  attachments,
  timeFormat,
  isHeader,
  getCustomEmoji,
  useRealName,
  showAttachment
}: IRoom247MessageProps) => {
  const { user, onPress, onLongPress } = useContext(MessageContext);
  
  const isOwn = author?.username === user?.username;
  const formattedDate = format(new Date(ts), timeFormat || 'h:mm a');
  
  // Get display name based on preference
  const getName = () => {
    if (!author) return '';
    return useRealName && author.name ? author.name : author.username;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
      activeOpacity={0.9}
    >
      {isHeader && !isOwn ? (
        <MessageAvatar
          author={author}
          small
        />
      ) : (
        <View style={styles.avatarContainer} />
      )}
      
      <View style={[
        isOwn ? styles.ownMessageBox : styles.messageBox,
        isHeader && styles.messageContentWithHeader
      ]}>
        {isHeader && !isOwn && (
          <Text style={[
            styles.username,
            { color: themes[theme].tintColor }
          ]}>
            {getName()}
          </Text>
        )}
        
        {msg ? (
          <Markdown
            msg={msg}
            theme={theme}
            baseUrl=""
            style={[
              styles.plainText,
              { color: themes[theme].bodyText }
            ]}
            username={user?.username}
            getCustomEmoji={getCustomEmoji}
          />
        ) : null}
        
        {attachments?.length ? (
          <Attachments
            attachments={attachments}
            timeFormat={timeFormat}
            showAttachment={showAttachment}
          />
        ) : null}
        
        <Text style={styles.time}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Room247Message; 