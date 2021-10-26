import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Linking,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const API_KEY = "5448715390df41aed509eef3faa3053b";
const date = new Date();
const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

function giveMeHours(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = date.getHours() + Math.floor((duration / (1000 * 60 * 60)) % 24);

  return hours;
}

function timeConversion(millisec) {
  var seconds = (millisec / 1000).toFixed(1);

  var minutes = (millisec / (1000 * 60)).toFixed(1);

  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return seconds + " Sec";
  } else if (minutes < 60) {
    return minutes + " Min";
  } else if (hours < 24) {
    return hours + " Hrs";
  } else {
    return days + " Days";
  }
}

function changeHours(time) {
  if (time >= 0 && time < 13) {
    return "오전" + time + "시";
  } else if (time >= 13 && time < 25) {
    return "오후" + (time - 12) + "시";
  } else if (time >= 25 && time < 37) {
    return "오전" + (time - 24) + "시";
  } else if (time >= 37 && time < 49) {
    return "오후" + (time - 36) + "시";
  }
}

const weatherOptions = {
  Thunderstorm: {
    iconName: "weather-lightning",
    gradient: ["#373B44", "#4286f4"],
    title: "천둥번개",
    subtitle: "Actually, outside of the house",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Drizzle: {
    iconName: "weather-hail",
    gradient: ["#89F7FE", "#66A6FF"],
    title: "이슬비",
    subtitle: "Is like rain, but gay 🏳️‍🌈",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Rain: {
    iconName: "weather-rainy",
    gradient: ["#00C6FB", "#005BEA"],
    title: "비가 촉촉",
    subtitle: "For more info look outside",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Snow: {
    iconName: "weather-snowy",
    gradient: ["#7DE2FC", "#B9B6E5"],
    title: "눈이 송송",
    subtitle: "Do you want to build a snowman? Fuck no.",
    nameOfSong: "눈 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%88%88+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Atmosphere: {
    iconName: "weather-hail",
    gradient: ["#89F7FE", "#66A6FF"],
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Clear: {
    iconName: "weather-sunny",
    gradient: ["#FF7300", "#FEF253"],
    title: "맑고 푸른 하늘이에요(개발자 마음처럼)",
    subtitle: "Go get your ass burnt",
    nameOfSong: "날씨 좋은 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%82%A0%EC%94%A8+%EC%A2%8B%EC%9D%80%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Clouds: {
    iconName: "weather-cloudy",
    gradient: ["#D7D2CC", "#304352"],
    title: "꾸릿꾸릿 흐릿흐릿",
    subtitle: "I know, fucking boring",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%ED%9D%90%EB%A6%B0+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Mist: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "꾸릿꾸릿 흐릿흐릿",
    subtitle: "It's like you have no glasses on.",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Dust: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "황사 ! 두꺼운 마스크 필수",
    subtitle: "Thanks a lot China 🖕🏻",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EA%BF%89%EA%BF%89%ED%95%9C+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Haze: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "꾸릿꾸릿 흐릿흐릿",
    subtitle: "Just don't go outside.",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
};

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const clothesOptions = {
  part1: { description: "민소매, 반팔, 반바지, 원피스" },
  part2: { description: "반팔, 얇은셔츠, 반바지, 면바지" },
  part3: { description: "얇은 가디건, 긴팔, 면바지, 청바지" },
  part4: { description: "얇은 니트, 맨투맨, 가디건, 청바지, 면바지" },
  part5: { description: "자켓, 가디건, 청바지, 스타킹, 면바지" },
  part6: { description: "자켓, 트렌치코트, 니트, 청바지, 스타킹" },
  part7: { description: "코트, 가죽자켓, 히트텍, 레깅스" },
  part8: { description: "패딩, 두꺼운 코트, 목도리, 기모제품" },
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [currents, setCurrents] = useState([]);
  const [hours, setHours] = useState([]);
  const now = date.getTime();
  const [country, setCountry] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk(false);
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync(
        {
          latitude,
          longitude,
        },
        { useGoogleMaps: false } // Option
      );
      setCity(location[0].city);
      // throw error;
      setCountry(location[0].country);

      const responseOfDaily = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      );

      const json = await responseOfDaily.json();
      setDays(json.daily);
      setHours(json.hourly);
      setCurrents(json.current);
      console.log("it`s working");
      console.log(hours[1].weather[0].main);
      console.log(days);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={weatherOptions[hours[1].weather[0].main].gradient}
        style={styles.background}
      >
        {/* <StatusBar barStyle="auto" /> */}
        <View style={styles.topContainer}>
          <View style={styles.localInfo}>
            <Ionicons name="location-outline" size={24} color="black" />
            <Text style={styles.cityName}>{city}, </Text>
            <Text style={styles.countryName}>{country}</Text>
          </View>

          {hours.length === 0 ? (
            <View style={{ ...styles.day, alignItems: "center" }}>
              <ActivityIndicator
                color="white"
                style={{ marginTop: 10 }}
                size="large"
              />
            </View>
          ) : (
            <View style={styles.tempAndNameAndDcp}>
              <View style={styles.weatherOfToday}>
                <Fontisto
                  name={icons[hours[1].weather[0].main]}
                  size={80}
                  color="white\"
                />
                <View style={styles.tempInfo}>
                  <View style={styles.twoTemp}>
                    <Text style={styles.temp__now}>
                      {parseFloat(hours[1].feels_like).toFixed(1)} /
                    </Text>
                    <Text style={styles.temp__min}>
                      {parseFloat(days[0].temp.min).toFixed(1)}℃
                    </Text>
                  </View>
                  <Text style={styles.temp__main}>
                    {weatherOptions[hours[1].weather[0].main].title}
                  </Text>
                </View>
              </View>
              {parseFloat(hours[1].feels_like).toFixed(1) >= 28 && (
                <View style={styles.ClothesOfToday}>
                  <Image
                    style={styles.clothes}
                    source={{
                      uri: "https://lounge-b.com/web/product/big/202011/b4d571ffb72a87c8e66ac56ac994c346.jpg",
                    }}
                  />
                  <Text style={styles.exampleOfClothes}>
                    {clothesOptions.part1.description}
                  </Text>
                </View>
              )}

              {parseFloat(hours[1].feels_like).toFixed(1) >= 23 &&
                parseFloat(hours[1].feels_like).toFixed(1) <= 27 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes}
                      source={{
                        uri: "https://lounge-b.com/web/product/big/202011/b4d571ffb72a87c8e66ac56ac994c346.jpg",
                      }}
                    />
                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part2.description}
                    </Text>
                  </View>
                )}

              {parseFloat(hours[1].feels_like).toFixed(1) >= 20 &&
                parseFloat(hours[1].feels_like).toFixed(1) <= 22 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes}
                      source={{
                        uri: "https://lounge-b.com/web/product/big/202011/b4d571ffb72a87c8e66ac56ac994c346.jpg",
                      }}
                    />
                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part3.description}
                    </Text>
                  </View>
                )}

              {parseFloat(hours[1].feels_like).toFixed(1) >= 17 &&
                parseFloat(hours[1].feels_like).toFixed(1) <= 19 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes}
                      source={{
                        uri: "https://lounge-b.com/web/product/big/202011/b4d571ffb72a87c8e66ac56ac994c346.jpg",
                      }}
                    />
                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part4.description}
                    </Text>
                  </View>
                )}

              {parseFloat(hours[1].feels_like).toFixed(1) >= 12 &&
                parseFloat(hours[1].feels_like).toFixed(1) <= 16 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes}
                      source={require("./img/part7.png")}
                    />

                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part5.description}
                    </Text>
                  </View>
                )}

              {parseFloat(hours[1].feels_like).toFixed(1) >= 9 &&
                parseFloat(hours[1].feels_like).toFixed(1) <= 11 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes}
                      source={{
                        uri: "https://lounge-b.com/web/product/big/202011/b4d571ffb72a87c8e66ac56ac994c346.jpg",
                      }}
                    />
                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part6.description}
                    </Text>
                  </View>
                )}

              {parseFloat(hours[1].feels_like).toFixed(1) >= 5 &&
                parseFloat(hours[1].feels_like).toFixed(1) <= 8 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes}
                      source={{
                        uri: "https://lounge-b.com/web/product/big/202011/b4d571ffb72a87c8e66ac56ac994c346.jpg",
                      }}
                    />
                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part7.description}
                    </Text>
                  </View>
                )}

              {parseFloat(hours[1].feels_like).toFixed(1) <= 4 && (
                <View style={styles.ClothesOfToday}>
                  <Image source={require("./img/part7.png")} />
                  <Text style={styles.exampleOfClothes}>
                    {clothesOptions.part8.description}
                  </Text>
                </View>
              )}

              <View style={styles.songOfToday}>
                <Text style={styles.madedText}>준비하면서 </Text>
                <Text
                  style={{ ...styles.madedText, color: "blue" }}
                  onPress={() =>
                    Linking.openURL(
                      weatherOptions[days[0].weather[0].main].youtubeLink
                    )
                  }
                >
                  "{weatherOptions[days[0].weather[0].main].nameOfSong}"
                </Text>
                <Text style={styles.madedText}> 들으러 가기</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.todayBar}>
            <Text style={{ fontSize: 25, fontWeight: "600" }}>Today</Text>
            <AntDesign
              style={styles.rigthright}
              name="doubleright"
              size={22}
              color="black"
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={"false"}
            pagingEnabled
            contentStyles={styles.scrollView}
          >
            {hours.slice(1, 15).map((hour, index) => (
              <View key={index} style={styles.infoOfTime}>
                <Text style={styles.infoOfTime__time}>
                  {changeHours(giveMeHours(hour.dt * 1000 - date.getTime()))}
                </Text>
                <Fontisto
                  name={icons[hour.weather[0].main]}
                  size={30}
                  color="white"
                />
                <Text style={styles.infoOfTime__temp}>
                  {parseFloat(hour.temp).toFixed(1)}℃
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cityName: {
    fontSize: 20,
  },
  countryName: {
    fontSize: 20,
  },
  songOfToday: {
    flex: 0.7,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flex: 4,
    backgroundColor: "transparent",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "rgba(56, 142, 255, 0.45)",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#00000000",
  },
  infoOfTime: {
    marginLeft: 17,
    alignItems: "center",
    marginBottom: -10,
  },
  infoOfTime__time: {
    color: "white",
    marginLeft: 8,
    marginRight: 10,
    marginBottom: 4,
  },
  date: { flexDirection: "row" },

  infoOfTime__temp: {
    marginTop: 4,
    color: "white",
  },
  todayBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 9,
  },
  localInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 14,
  },
  tempInfo: {
    flexDirection: "column",
  },
  weatherOfToday: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  twoTemp: {
    flexDirection: "row",
    marginBottom: 7,
  },
  temp__now: {
    fontSize: 50,
    fontWeight: "600",
    color: "white",
  },
  temp__min: {
    marginTop: 35,
    marginLeft: 6,
    fontWeight: "400",
    fontSize: 20,
    color: "white",
  },
  temp__main: {
    marginLeft: 7,
    color: "white",
    fontWeight: "900",
  },
  ClothesOfToday: {
    flex: 3,
    backgroundColor: "green",
    flexDirection: "column",
    alignItems: "center",
    borderColor: "white",
    marginRight: 17,
    marginLeft: 17,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  exampleOfClothes: {
    marginTop: 120,
    marginBottom: 16,
    borderEndColor: "black",
    fontSize: 20,
    backgroundColor: "tomato",
  },
  tempAndNameAndDcp: {
    flex: 11,
  },
  madedText: {
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
  clothes: {
    width: 100,
    height: 100,
  },
  background: {
    flex: 1,
  },
  rigthright: {
    marginTop: 3,
    marginRight: -10,
  },
});
