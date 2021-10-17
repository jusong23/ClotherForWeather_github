import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Linking,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
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

  return hours + 11;
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
    title: "비",
    subtitle: "For more info look outside",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Snow: {
    iconName: "weather-snowy",
    gradient: ["#7DE2FC", "#B9B6E5"],
    title: "눈",
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
    title: "맑음",
    subtitle: "Go get your ass burnt",
    nameOfSong: "날씨 좋은 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%82%A0%EC%94%A8+%EC%A2%8B%EC%9D%80%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Clouds: {
    iconName: "weather-cloudy",
    gradient: ["#D7D2CC", "#304352"],
    title: "흐림",
    subtitle: "I know, fucking boring",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%ED%9D%90%EB%A6%B0+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Mist: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "흐림",
    subtitle: "It's like you have no glasses on.",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Dust: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "황사",
    subtitle: "Thanks a lot China 🖕🏻",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EA%BF%89%EA%BF%89%ED%95%9C+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Haze: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "안개",
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

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
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
      console.log("BAND");
      const slicedHours = hours.splice(13, 36);
      slicedHours.map(
        (hour, index) =>
          console.log(changeHours(giveMeHours(hour.dt * 1000 - date.getTime()))) // 현재 시간으로 부터 더해야할 시간
      );
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.localInfo}>
        <Text style={styles.cityName}>{city}, </Text>
        <Text style={styles.countryName}>{country}</Text>
      </View>
      <View style={styles.date}>
        <Text style={styles.date__month}>{date.getMonth() + 1}월 </Text>
        <Text style={styles.date__date}>{date.getDate()}일 </Text>
        <Text style={styles.date__day}>{WEEKDAY[date.getDay() + 1]}요일</Text>
      </View>
      {days.length === 0 ? (
        <Text>Loading Icon</Text>
      ) : (
        <View style={styles.temp}>
          <Text style={styles.temp__eve}>
            평균기온 : {parseFloat(days[0].temp.eve).toFixed(1)}℃
          </Text>
          <Text style={styles.temp__max}>
            최고기온 : {parseFloat(days[0].temp.max).toFixed(1)}℃
          </Text>
          <Text style={styles.temp__min}>
            최저기온 : {parseFloat(days[0].temp.min).toFixed(1)}℃
          </Text>
          <Text style={styles.temp__name}>
            날씨 이름 : {weatherOptions[days[0].weather[0].main].title}
          </Text>
          <Text style={styles.temp__description}>
            날씨 묘사 : {weatherOptions[days[0].weather[0].main].subtitle}
          </Text>
          <Fontisto
            name={icons[days[0].weather[0].main]}
            size={68}
            color="white"
          />
          <View style={styles.songOfToday}>
            <Text style={{ color: "white" }}>준비하면서 </Text>
            <Text
              style={{ color: "blue" }}
              onPress={() =>
                Linking.openURL(
                  weatherOptions[days[0].weather[0].main].youtubeLink
                )
              }
            >
              "{weatherOptions[days[0].weather[0].main].nameOfSong}"
            </Text>
            <Text> 들으러 가기</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  localInfo: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  date: {
    flexDirection: "row",
    backgroundColor: "tomato",
    justifyContent: "flex-start",
  },
  songOfToday: {
    flexDirection: "row",
  },
});
