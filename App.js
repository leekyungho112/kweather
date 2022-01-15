import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Food from './src/components/Food';
import { parseString } from 'xml2js';
import NeuMorph from './src/components/NeuMorph';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const API_KEY = '8fd9cac23b610f4edb9c914bbfb03e9b';
const HOST = 'http://api.nongsaro.go.kr/service/monthFd/monthNewFdLst';
const API_FOOD_KEY = '202111123KJUAOHXRI8PCYSSN9SSW';
const icon = {
  Rain: require('./assets/images/rain.png'),
  Clouds: require('./assets/images/cloud.png'),
  Clear: require('./assets/images/sun.png'),
  Snow: require('./assets/images/snow.png'),
  Drizzle: require('./assets/images/drizzle.png'),
  Atmosphere: require('./assets/images/atom.png'),
  Thunderstorm: require('./assets/images/thunder.png'),
};

const bg = {
  Snow: require('./assets/images/bgsnow.png'),
  Clear: require('./assets/images/clearbg.png'),

  Clouds: require('./assets/images/bgcloud.png'),
  Rain: require('./assets/images/raining.png'),

  Thunderstorm: require('./assets/images/bgthunder.png'),
  Drizzle: require('./assets/images/bgdrizzle.png'),
  Atmosphere: require('./assets/images/clearbg.png'),
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  const [food, setFood] = useState([]);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  const getFood = () => {
    const requestURL = `${HOST}?apiKey=${API_FOOD_KEY}&thisYear=2017&thisMonth=12`;
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
  useEffect(() => {
    getWeather();
    getFood();
    return () => getWeather();
  }, []);

  const time = days.map((day) => {
    const week = new Array(
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일'
    );
    const timestamp = parseInt(day.dt) * 1000;

    const date = new Date(timestamp);

    const getday = date.getDay();
    const today = week[getday];
    return `${today}, ${date.getMonth() + 1} ${date.getDate()} `;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {days.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator
            color="tomato"
            size="large"
            style={{ marginTop: 10 }}
          />
        </View>
      ) : (
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}
        >
          {days.map((day, index) => (
            <View key={index} style={styles.day}>
              <NeuMorph boxSize={290}>
                <ImageBackground
                  style={{
                    width: 290,
                    height: 380,
                    alignItems: 'center',
                    resizeMode: 'cover',
                  }}
                  resizeMode="cover"
                  imageStyle={{ borderRadius: 20, opacity: 0.8 }}
                  source={bg[day.weather[0].main]}
                >
                  <View style={styles.locationInfo}>
                    <Text style={styles.cityName}>{city}</Text>
                    <Text style={styles.cityName}>{time[index]}</Text>
                  </View>

                  <Image
                    style={{
                      width: 140,
                      height: 140,
                      backgroundColor: 'transparent',
                      position: 'absolute',
                      top: -60,
                      right: -40,
                    }}
                    source={icon[day.weather[0].main]}
                  />

                  <View style={styles.dayIcon}>
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}°
                    </Text>
                  </View>
                  <Text style={styles.dec}>{day.weather[0].description}</Text>
                  <Text style={styles.tinyText}>
                    최고:{parseFloat(day.temp.max).toFixed(0)}° 최저:
                    {parseFloat(day.temp.min).toFixed(0)}°
                  </Text>
                </ImageBackground>
              </NeuMorph>
            </View>
          ))}
        </ScrollView>
      )}
      {food.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator
            color="tomato"
            size="large"
            style={{ marginTop: 10 }}
          />
        </View>
      ) : (
        <NeuMorph style={styles.bottom}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: 'white',
              marginVertical: 7,
              fontWeight: 'bold',
            }}
          >
            Monthly Dishes
          </Text>
          <ScrollView
            style={{
              flexDirection: 'row',
              marginHorizontal: 2,
            }}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {food.map((item) =>
              item.items.map((list) =>
                list.item.map((i, index) => (
                  <View key={index} style={{ width: SCREEN_WIDTH / 2.7 }}>
                    <Food item={i} />
                  </View>
                ))
              )
            )}
          </ScrollView>
        </NeuMorph>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#5fa592',
  },
  locationInfo: {
    marginTop: 70,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cityName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },

  weather: {},
  day: {
    marginTop: 90,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  dayIcon: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  temp: {
    marginLeft: 30,
    fontSize: 90,
    fontWeight: 'bold',
    color: 'white',
  },
  dec: {
    fontSize: 16,
    color: '#2F4858',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  tinyText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  bottom: {
    marginBottom: 25,
  },
});
