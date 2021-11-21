import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NeuMorph = ({
  children,
  boxSize,
  style,
  circleSize,
  imgSize,
  btnSize,
}) => {
  return (
    <View style={styles.topShadow}>
      <View style={styles.bottomShadow}>
        <View
          style={[
            styles.inner,
            {
              borderRadius: 20 || btnSize / 2,
              width:
                boxSize ||
                btnSize ||
                circleSize ||
                imgSize ||
                SCREEN_WIDTH - 20,
              height:
                boxSize + 90 ||
                btnSize ||
                circleSize / 4 ||
                imgSize - 120 ||
                200,
            },
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ...Platform.select({
    ios: {
      inner: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5fa592',
      },
      topShadow: {
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowColor: '#67b29e',
      },
      bottomShadow: {
        shadowOffset: {
          width: -5,
          height: -5,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowColor: '#579886',
      },
    },
    android: {
      inner: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5fa592',
        elevation: 5,
      },
      topShadow: {
        elevation: 5,
      },
      bottomShadow: {
        elevation: 5,
      },
    },
  }),
});
export default NeuMorph;
