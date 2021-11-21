import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FoodDetail from './FoodDetail';
import { Fontisto } from '@expo/vector-icons';
import NeuMorph from './NeuMorph';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const Food = ({ item }) => {
  const [isModal, setModal] = useState(false);
  const [foodindex, setFoodIndex] = useState(0);

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <View
        style={{
          backgroundColor: '#dcdde1',
          position: 'relative',
          height: 110,
          width: 130,
          borderRadius: 10,
          marginTop: 20,
          borderColor: '#a9ead9',
          borderWidth: 3,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setModal(true);
            setFoodIndex(item.cntntsNo[0]);
          }}
        >
          <Image
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              borderColor: '#a9ead9',
              borderWidth: 3,
              resizeMode: 'cover',
              position: 'absolute',
              top: -40,
              left: 18,
            }}
            source={{
              uri: `http://www.nongsaro.go.kr/${
                item.rtnFileCours[0].split('|')[0]
              }/${item.rtnStreFileNm[0].split('|')[0]}`,
            }}
          />

          <Text
            style={{
              fontSize: 12,
              color: '#0097e6',
              fontWeight: 'bold',
              marginTop: 60,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {item.fdNm[0]}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={isModal}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 0,
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: 650,
            backgroundColor: '#5fa592',
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
            borderTopWidth: 2,
            borderTopColor: '#a9ead9',
            borderStartColor: '#a9ead9',
            borderStartWidth: 2,
            borderEndColor: '#a9ead9',
            borderEndWidth: 2,
          }}
        >
          <View
            style={{
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => setModal(false)}>
              <NeuMorph btnSize={50} style={styles.btn}>
                <Fontisto
                  style={{ textAlign: 'center' }}
                  name="close"
                  size={30}
                  color="white"
                />
              </NeuMorph>
            </TouchableOpacity>
          </View>
          <FoodDetail foodIdx={foodindex} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Food;
