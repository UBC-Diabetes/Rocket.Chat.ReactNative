import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TSupportedThemes } from '../../theme';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f0f0f0', // WhatsApp-like input background
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  composerContainer: {
    borderRadius: 20,
    backgroundColor: '#fff', // White input field
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  }
});

interface IWhatsAppComposerProps {
  children: React.ReactNode;
  theme: TSupportedThemes;
}

const WhatsAppComposer = ({ children, theme }: IWhatsAppComposerProps) => {
  // Get the child element (MessageComposer) to style
  const child = React.Children.only(children) as React.ReactElement;
  
  return (
    <View style={styles.container}>
      <View style={styles.composerContainer}>
        {React.cloneElement(child, {
          style: [child.props.style],
          containerStyle: {
            borderRadius: 20,
            paddingHorizontal: 12,
            minHeight: 40,
          },
          inputStyle: {
            fontSize: 16,
          }
        })}
      </View>
    </View>
  );
};

export default WhatsAppComposer; 