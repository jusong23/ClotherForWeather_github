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
  TouchableOpacity,
  Button,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
import Loading from "./Loading";
import * as Location from "expo-location";
import {
  AntDesign,
  Ionicons,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

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
    title: "천둥 번개가 쳐요 ⚡️",
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
    title: "비가 촉촉 💦",
    subtitle: "For more info look outside",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Snow: {
    iconName: "weather-snowy",
    gradient: ["#7DE2FC", "#B9B6E5"],
    title: "눈이 송송 ☃️",
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
    title: "맑고 청명해요 🌞",
    subtitle: "Go get your ass burnt",
    nameOfSong: "날씨 좋은 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%82%A0%EC%94%A8+%EC%A2%8B%EC%9D%80%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Clouds: {
    iconName: "weather-cloudy",
    gradient: ["#D7D2CC", "#304352"],
    title: "꾸릿꾸릿 흐릿흐릿 ☁️",
    subtitle: "I know, fucking boring",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%ED%9D%90%EB%A6%B0+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Mist: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "꾸릿꾸릿 흐릿흐릿 ☁️",
    subtitle: "It's like you have no glasses on.",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Dust: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "황사 ! 두꺼운 마스크 필수 😷",
    subtitle: "Thanks a lot China 🖕🏻",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EA%BF%89%EA%BF%89%ED%95%9C+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Haze: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "꾸릿꾸릿 흐릿흐릿 ☁️",
    subtitle: "Just don't go outside.",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
};

const goTo = () => {
  console.log("optionalPage");
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
  part1: { description: "반팔, 민소매, 원피스, 반바지" },
  part2: { description: "반팔, 얇은셔츠, 반바지, 면바지" },
  part3: { description: "얇은 가디건, 긴팔, 면바지, 청바지" },
  part4: { description: "가디건, 얇은 니트, 맨투맨, 청바지" },
  part5: { description: "자켓, 가디건, 청바지, 면바지" },
  part6: { description: "트렌치코트, 자켓, 니트, 청바지" },
  part7: { description: "코트, 니트, 가죽자켓, 히트텍" },
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
      // if(json) {}
      setDays(json.daily);
      setHours(json.hourly);
      setCurrents(json.current);
      console.log("it`s working");
    } catch (error) {}
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      {hours.length === 0 ? (
        <Loading />
      ) : (
        <LinearGradient
          // Background Linear Gradient
          colors={weatherOptions[hours[1].weather[0].main].gradient}
          style={styles.background}
        >
          {/* <StatusBar barStyle="auto" /> */}
          <View style={styles.topContainer}>
            <View style={styles.emptyContainer_2}></View>

            <View style={styles.localInfo}>
              <Ionicons name="location-outline" size={24} color="white" />
              <Text style={styles.cityName}> {city}, </Text>
              <Text style={styles.countryName}>{country}</Text>
            </View>

            {days.length === 0 ? (
              <View style={{ ...styles.day, alignItems: "center" }}>
                <ActivityIndicator
                  color="white"
                  style={{ marginTop: 10 }}
                  size="large"
                />
              </View>
            ) : (
              <View style={styles.tempAndNameAndDcp}>
                <View style={styles.emptyContainer}></View>
                <View style={styles.weatherOfToday}>
                  <Fontisto
                    name={icons[hours[1].weather[0].main]}
                    size={80}
                    color="white"
                  />
                  <View style={styles.tempInfo}>
                    <View style={styles.twoTemp}>
                      <Text style={styles.temp__now}>
                        {parseFloat(hours[1].feels_like).toFixed(0)} /
                      </Text>
                      <Text style={styles.temp__min}>
                        {parseFloat(days[0].temp.min - 5).toFixed(0) === "-0"
                          ? "0℃"
                          : parseFloat(days[0].temp.min - 5).toFixed(0) + "℃"}
                      </Text>
                    </View>
                    <Text style={styles.temp__main}>
                      {weatherOptions[hours[1].weather[0].main].title}
                    </Text>
                  </View>
                </View>
                {parseFloat(hours[1].feels_like).toFixed(0) >= 28 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes__part1}
                      source={require("./img/part1_1.png")}
                    />
                    <Image
                      style={styles.clothes__part2}
                      source={require("./img/part1_2.png")}
                    />
                    <Text style={styles.exampleOfClothes}>
                      {clothesOptions.part1.description}
                    </Text>
                  </View>
                )}

                {parseFloat(hours[1].feels_like).toFixed(0) >= 23 &&
                  parseFloat(hours[1].feels_like).toFixed(0) < 28 && (
                    <View style={styles.ClothesOfToday}>
                      <Image
                        style={styles.clothes__part1}
                        source={require("./img/part2_1.png")}
                      />
                      <Image
                        style={styles.clothes__part2}
                        source={require("./img/part2_2.png")}
                      />
                      <Text style={styles.exampleOfClothes}>
                        {clothesOptions.part2.description}
                      </Text>
                    </View>
                  )}

                {parseFloat(hours[1].feels_like).toFixed(0) >= 20 &&
                  parseFloat(hours[1].feels_like).toFixed(0) < 23 && (
                    <View style={styles.ClothesOfToday}>
                      <Image
                        style={styles.clothes__part1}
                        source={require("./img/part3_1.png")}
                      />
                      <Image
                        style={styles.clothes__part2}
                        source={require("./img/part3_2.png")}
                      />
                      <Text style={styles.exampleOfClothes}>
                        {clothesOptions.part3.description}
                      </Text>
                    </View>
                  )}

                {parseFloat(hours[1].feels_like).toFixed(0) >= 17 &&
                  parseFloat(hours[1].feels_like).toFixed(0) < 20 && (
                    <View style={styles.ClothesOfToday}>
                      <Image
                        style={styles.clothes__part1}
                        source={require("./img/part4_1.png")}
                      />
                      <Image
                        style={styles.clothes__part2}
                        source={require("./img/part4_2.png")}
                      />
                      <Text style={styles.exampleOfClothes}>
                        {clothesOptions.part4.description}
                      </Text>
                    </View>
                  )}

                {parseFloat(hours[1].feels_like).toFixed(0) >= 12 &&
                  parseFloat(hours[1].feels_like).toFixed(0) < 17 && (
                    <View style={styles.ClothesOfToday}>
                      <Image
                        style={styles.clothes__part1}
                        source={require("./img/part5_1.png")}
                      />
                      <Image
                        style={styles.clothes__part2}
                        source={require("./img/part5_2.png")}
                      />
                      <View style={styles.goToTheMainPhoto}>
                        <Text style={styles.exampleOfClothes}>
                          {clothesOptions.part5.description}
                        </Text>
                      </View>
                    </View>
                  )}

                {parseFloat(hours[1].feels_like).toFixed(0) >= 9 &&
                  parseFloat(hours[1].feels_like).toFixed(0) < 12 && (
                    <View style={styles.ClothesOfToday}>
                      <Image
                        style={styles.clothes__part1}
                        source={require("./img/part6_1.png")}
                      />
                      <Image
                        style={styles.clothes__part2}
                        source={require("./img/part6_2.png")}
                      />
                      <Text style={styles.exampleOfClothes}>
                        {clothesOptions.part6.description}
                      </Text>
                    </View>
                  )}

                {parseFloat(hours[1].feels_like).toFixed(0) >= 5 &&
                  parseFloat(hours[1].feels_like).toFixed(0) < 9 && (
                    <View style={styles.ClothesOfToday}>
                      <Image
                        style={styles.clothes__part1}
                        resizeMode="stretch"
                        source={require("./img/part7_1.png")}
                      />
                      <Image
                        style={styles.clothes__part2}
                        resizeMode="stretch"
                        source={require("./img/part7_2.png")}
                      />
                      <Text style={styles.exampleOfClothes}>
                        {clothesOptions.part7.description}
                      </Text>
                    </View>
                  )}

                {parseFloat(hours[1].feels_like).toFixed(0) < 5 && (
                  <View style={styles.ClothesOfToday}>
                    <Image
                      style={styles.clothes__part1}
                      source={require("./img/part8_1.png")}
                    />
                    <Image
                      style={styles.clothes__part2}
                      source={require("./img/part8_2.png")}
                    />
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
                        weatherOptions[hours[1].weather[0].main].youtubeLink
                      )
                    }
                  >
                    "{weatherOptions[hours[1].weather[0].main].nameOfSong}"
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
                  {days[1].sunrise > hour.dt && days[0].sunset < hour.dt ? (
                    <View style={styles.infoOfTime}>
                      <Text style={styles.infoOfTime__time}>
                        {changeHours(
                          giveMeHours(hour.dt * 1000 - date.getTime())
                        )}
                      </Text>
                      <MaterialIcons
                        name="nights-stay"
                        size={30}
                        color="white"
                      />
                      <Text style={styles.infoOfTime__temp}>
                        {parseFloat(hour.temp).toFixed(0)}℃
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.infoOfTime}>
                      <Text style={styles.infoOfTime__time}>
                        {changeHours(
                          giveMeHours(hour.dt * 1000 - date.getTime())
                        )}
                      </Text>
                      <Fontisto
                        name={icons[hour.weather[0].main]}
                        size={30}
                        color="white"
                      />
                      <Text style={styles.infoOfTime__temp}>
                        {parseFloat(hour.temp).toFixed(0)}℃
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  cityName: {
    fontSize: 25,
    color: "white",
  },
  countryName: {
    fontSize: 28,
    color: "white",
  },
  songOfToday: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flex: 4.5,
    backgroundColor: "transparent",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "rgba(56, 142, 255, 0.8)",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#00000000",
  },
  infoOfTime: {
    marginLeft: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  infoOfTime__time: {
    color: "white",
    marginLeft: 8,
    marginRight: 10,
    marginBottom: 4,
    fontWeight: "600",
  },
  date: { flexDirection: "row" },
  infoOfTime__temp: {
    marginTop: 4,
    color: "white",
    fontWeight: "600",
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
    flex: 0.6,
    height: "10%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  tempInfo: {
    flexDirection: "column",
  },
  weatherOfToday: {
    height: "30%",
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-evenly",
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
    fontWeight: "800",
  },
  ClothesOfToday: {
    height: "60%",
    backgroundColor: "white",
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
    borderEndColor: "black",
    fontSize: 24,
    fontWeight: "500",
  },
  tempAndNameAndDcp: {
    flex: 4,
  },
  madedText: {
    fontWeight: "500",
    fontSize: 16,
    color: "black",
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
  clothes__part1: {
    marginTop: 5,
    width: "78%",
    height: "40%",
  },
  clothes__part2: { width: "30%", height: "45%" },

  emptyContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  emptyContainer_2: {
    flex: 0.1,
  },
  goToTheMainPhoto: {
    flex: 1,
    width: "88%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
