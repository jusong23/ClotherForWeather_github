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
      console.log(currents.weather.length);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
  
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
    flexDirection: "row",
    justifyContent: "center",
  },
  topContainer: {
    flex: 3,
    backgroundColor: "#46e2e2",
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#4765ff",
  },
  clothes: {
    width: 100,
    height: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#4765ff",
  },
  infoOfTime: {
    backgroundColor: "green",
    marginLeft: 30,
    alignItems: "center",
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
  },
  todayBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 3,
  },
  localInfo: {
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
  },
  temp__min: { marginTop: 35, marginLeft: 6, fontWeight: "400", fontSize: 20 },
  temp__main: {
    marginLeft: 7,
  },
  ClothesOfToday: {
    backgroundColor: "#8a6dff",
  },
});
