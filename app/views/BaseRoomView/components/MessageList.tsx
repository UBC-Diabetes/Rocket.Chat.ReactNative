import React, { forwardRef } from 'react';
import { List } from '../../../../containers/List';
import { IBaseRoomViewProps } from '../definitions';

interface IMessageListProps {
  rid: string;
  tmid?: string;
  loading: boolean;
  hideSystemMessages: string[];
  showMessageInMainThread: boolean;
  serverVersion: string | null;
  renderRow: (item: any) => React.ReactElement;
}

const MessageList = forwardRef<any, IMessageListProps>(({
  rid,
  tmid,
  loading,
  hideSystemMessages,
  showMessageInMainThread,
  serverVersion,
  renderRow
}, ref) => {
  return (
    <List
      ref={ref}
      rid={rid}
      tmid={tmid}
      renderRow={renderRow}
      loading={loading}
      hideSystemMessages={hideSystemMessages}
      showMessageInMainThread={showMessageInMainThread}
      serverVersion={serverVersion}
    />
  );
});

export default MessageList; 