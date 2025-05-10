import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

// Styles inspired by WhatsApp
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e5ddd5', // WhatsApp-like chat background color
  },
  messageWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  messageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 1,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6', // Light green for own messages
    marginLeft: 60,
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff', // White for received messages
    marginRight: 60,
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  childContainer: {
    backgroundColor: 'transparent',
  }
});

interface IWhatsAppStyleProps {
  isOwn: boolean;
  children: React.ReactNode;
}

const WhatsAppStyle = ({ isOwn, children }: IWhatsAppStyleProps) => {
  // No need to style system messages or special message types
  const child = React.Children.only(children) as React.ReactElement;

  if (child.props.isInfo || child.props.type === 'jitsi_call_started' || child.props.type === 'discussion-created') {
    return children;
  }

  return (
    <View style={isOwn ? styles.ownMessage : styles.otherMessage}>
      {React.cloneElement(child, {
        style: [child.props.style, styles.childContainer]
      })}
    </View>
  );
};

interface IWhatsAppBackgroundProps {
  children: React.ReactNode;
}

export const WhatsAppBackground = ({ children }: IWhatsAppBackgroundProps) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage} />
      <View style={styles.messageWrapper}>
        {children}
      </View>
    </View>
  );
};

export default WhatsAppStyle; 