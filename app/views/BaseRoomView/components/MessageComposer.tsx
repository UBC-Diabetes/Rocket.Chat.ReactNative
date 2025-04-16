import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { withTheme } from '../../../../theme';
import { themes } from '../../../../lib/constants';
import { IBaseRoomViewProps } from '../definitions';

interface IMessageComposerProps {
  rid: string;
  tmid?: string;
  onSendMessage: (message: string) => void;
  onReply: (messageId: string) => void;
  readOnly: boolean;
  theme: string;
}

const MessageComposer = forwardRef<any, IMessageComposerProps>(({
  rid,
  tmid,
  onSendMessage,
  onReply,
  readOnly,
  theme
}, ref) => {
  return (
    <View style={{ backgroundColor: themes[theme].surfaceRoom }}>
      {/* Message composer implementation */}
    </View>
  );
});

export default withTheme(MessageComposer); 