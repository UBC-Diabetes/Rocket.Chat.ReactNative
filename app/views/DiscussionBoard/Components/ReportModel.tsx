import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Platform, StyleSheet, useWindowDimensions, StatusBar, ViewProps, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SlidingUpPanel from 'rn-sliding-up-panel';

type Props = {
  show: boolean;
  close: () => void;
  children?: React.ReactNode;
  customStyles?: ViewProps['style'];
  darkBackground?: boolean;
};

const ReportModal: React.FC<Props> = (props) => {
  const { show, close, children, customStyles, darkBackground } = props;
  const modalContentRef = useRef<View>(null);
  const [isBackButtonPressed, setIsBackButtonPressed] = React.useState(false);
  
	const handleOverlayPress = () => {
	  if (!isBackButtonPressed) {
		close();
	  } else {
		// Reset the flag to allow future modals to close
		setIsBackButtonPressed(false);
	  }
	};
  
	const handleModalContentPress = () => {
	  setIsBackButtonPressed(true);
  
	  // Set a timeout to reset the flag after a certain duration
	  setTimeout(() => {
		setIsBackButtonPressed(false);
	  }, 1000); // Adjust the duration as needed
	};

  const ios = Platform.OS === 'ios';
  const panelRef = useRef(null);
  const deviceHeight = useWindowDimensions().height;
  const insets = useSafeAreaInsets();
  const statusBarHeight = ios ? insets.bottom : StatusBar.currentHeight;
  const draggableRange = {
    top: deviceHeight - statusBarHeight,
    bottom: deviceHeight / 2,
  };
  const snappingPoints = [draggableRange.top, draggableRange.bottom];

  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [allowDragging, setAllowDragging] = useState(true);
  const [atTop, setAtTop] = useState(true);

  // fired when panel is finished being dragged up or down
  // if panel is dragged to 'top' position, then we switch to scrollmode
  const onMomentumDragEnd = useCallback(
    (value) => {
      if (value === draggableRange.top && !scrollEnabled) {
        setScrollEnabled(true);
        setAtTop(true);
      }
    },
    [draggableRange, scrollEnabled],
  );

  const PANEL_VELOCITY = ios ? 1 : 2.3;
  const hideFullScreenPanelOptions = {
    velocity: PANEL_VELOCITY,
    toValue: draggableRange.bottom,
  };

  const onDragStart = useCallback(
    (_, gestureState) => {
      if (atTop && scrollEnabled) {
        if (gestureState.vy > 0) {
          setScrollEnabled(false);
          if (ios) {
            setAllowDragging(true);
          }
          if (panelRef && panelRef.current) {
            panelRef.current.show(hideFullScreenPanelOptions);
          }
        } else {
          setAtTop(false);
          if (ios) {
            setAllowDragging(false);
          }
        }
      }
    },
    [atTop, scrollEnabled, panelRef],
  );
  
  const [panelPositionVal] = useState(
    new Animated.Value(draggableRange.bottom),
  );

  useEffect(() => {
    // Use panelRef to show/hide the panel based on the 'show' prop
    if (panelRef.current) {
      if (show) {
        panelRef.current.show();
      } else {
        panelRef.current.hide();
      }
    }
  }, [show]);

  return (
    <SlidingUpPanel
      ref={panelRef}
      animatedValue={panelPositionVal}
      draggableRange={draggableRange}
      snappingPoints={snappingPoints}
      backdropOpacity={0}
      showBackdrop={false}
      height={deviceHeight}
      allowDragging={allowDragging}
      onMomentumDragEnd={onMomentumDragEnd}
      onDragStart={onDragStart}>
      <View style={[styles.flexContainer, darkBackground && styles.darkBackground]}>
        <View
          ref={modalContentRef}
          onTouchStart={handleModalContentPress}
          style={[styles.content, customStyles]}>
          {children && children}
        </View>
        <View
          style={styles.overlay}
          pointerEvents="box-none"
          onTouchStart={handleOverlayPress}
        />
      </View>
    </SlidingUpPanel>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: '#00000080',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: 100,
    elevation: 5,
  },
});
