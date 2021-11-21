import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { parseString } from 'xml2js';
import NeuMorph from './NeuMorph';
import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

const HOST = 'http://api.nongsaro.go.kr/service/monthFd/monthNewFdDtl';
const API_KEY = '202111123KJUAOHXRI8PCYSSN9SSW';

const FoodDetail = ({ foodIdx }) => {
  const [food, setFood] = useState([]);
  const requestURL = `${HOST}?apiKey=${API_KEY}&cntntsNo=${foodIdx}`;
  useEffect(() => {
    fetchData();
    return () => fetchData();
  }, []);

  const fetchData = () => {
    fetch(requestURL)
      .then((response) => response.text())
      .then((resText) => {
        parseString(resText, (err, result) => {
          if (err !== null) {
            console.log('Fail');
          } else {
            const { body } = result.response;
            setFood(body);
          }
        });
      })
      .catch((error) => console.log(error));
  };

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
  };
  return (
    <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
      {food.length === 0 ? (
        <Text>loading....</Text>
      ) : (
        food.map((f) =>
          f.item.map((item, index) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
              key={index}
            >
              <NeuMorph circleSize={300}>
                <Text
                  style={{
                    marginVertical: 10,
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 20,
                    textAlign: 'center',
                  }}
                >
                  {item.fdNm[0]} 레시피
                </Text>
              </NeuMorph>

              <ScrollView style={{}} horizontal pagingEnabled>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 30,
                  }}
                >
                  {item.rtnStreFileNm[0].split('|').map((i, idx) => (
                    <NeuMorph key={idx} style={styles.img} imgSize={300}>
                      <Image
                        style={{
                          width: 300,
                          height: 180,
                          borderRadius: 20,
                        }}
                        source={{
                          uri: `http://www.nongsaro.go.kr/${
                            item.rtnFileCours[0].split('|')[0]
                          }/${i}`,
                        }}
                      />
                    </NeuMorph>
                  ))}
                </View>
              </ScrollView>
              <NeuMorph btnSize={50} style={styles.btn}>
                <Fontisto name="info" size={24} color="white" />
              </NeuMorph>
              <NeuMorph style={styles.foods} imgSize={350}>
                <Text
                  style={{
                    fontSize: 17,
                    color: '#006928',
                    fontWeight: 'bold',
                    paddingHorizontal: 10,
                  }}
                >
                  {item.matrlInfo[0] ? item.matrlInfo[0] : '준비중입니다....'}
                </Text>
              </NeuMorph>
              <NeuMorph btnSize={50} style={styles.btn}>
                <MaterialCommunityIcons
                  name="details"
                  size={28}
                  color="white"
                />
              </NeuMorph>
              <NeuMorph style={styles.foods} boxSize={350}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#364B45',
                    marginBottom: 10,
                  }}
                >
                  조리 과정
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#364B45',
                    textAlign: 'left',
                    paddingHorizontal: 10,
                    fontWeight: 'bold',
                  }}
                >
                  {item.ckngMthInfo[0]
                    ? item.ckngMthInfo[0]
                    : '준비중입니다....'}
                </Text>
              </NeuMorph>
              <NeuMorph style={styles.foods} circleSize={180}>
                <Text
                  style={{ fontSize: 16, color: 'white', fontWeight: '600' }}
                >
                  영양성분(1인분) 그래프
                </Text>
              </NeuMorph>
              <BarChart
                data={{
                  labels: [
                    '에너지(kcal)',
                    '탄수화물(g)',
                    '지질(g)',
                    '단백질(g)',
                    '식이섬유(g)',
                  ],
                  datasets: [
                    {
                      data: [
                        parseInt(item.energyQy[0]),
                        parseInt(item.crbQy[0]),
                        parseInt(item.ntrfsQy[0]),
                        parseInt(item.protQy[0]),
                        parseInt(item.edblfibrQy[0]),
                      ],
                    },
                  ],
                }}
                width={370}
                height={400}
                verticalLabelRotation={60}
                chartConfig={chartConfig}
                style={{ borderRadius: 10, marginVertical: 40 }}
              />
            </View>
          ))
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  infoText: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    width: '100%',
  },
  img: {
    marginHorizontal: 10,
  },
  foods: {
    marginVertical: 20,
  },
});

export default FoodDetail;
