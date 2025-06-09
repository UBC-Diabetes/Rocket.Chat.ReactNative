import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TSupportedThemes } from '../../theme';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    // Removed the extra styling to match normal MessageComposer
  }
});

interface IWhatsAppComposerProps {
  children: React.ReactNode;
  theme: TSupportedThemes;
}

const WhatsAppComposer = ({ children, theme }: IWhatsAppComposerProps) => {
  // Get the child element (MessageComposer) and pass it through with minimal styling
  const child = React.Children.only(children) as React.ReactElement;
  
  return (
    <View style={styles.container}>
      {React.cloneElement(child, {
        style: [child.props.style],
        // Removed custom styling to match normal MessageComposer
      })}
    </View>
  );
};

export default WhatsAppComposer; 