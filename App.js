import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import * as Location from "expo-location";

const API_KEY = "5448715390df41aed509eef3faa3053b";
const date = new Date();
const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

const weatherOptions = {
  Thunderstorm: {
    iconName: "weather-lightning",
    gradient: ["#373B44", "#4286f4"],
    title: "Thunderstorm in the house",
    subtitle: "Actually, outside of the house",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Drizzle: {
    iconName: "weather-hail",
    gradient: ["#89F7FE", "#66A6FF"],
    title: "Drizzle",
    subtitle: "Is like rain, but gay 🏳️‍🌈",
    nameOfSong: "",
    youtubeLink: "",
  },
  Rain: {
    iconName: "weather-rainy",
    gradient: ["#00C6FB", "#005BEA"],
    title: "Raining like a MF",
    subtitle: "For more info look outside",
    nameOfSong: "비 오는 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%B9%84+%EC%98%A4%EB%8A%94+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Snow: {
    iconName: "weather-snowy",
    gradient: ["#7DE2FC", "#B9B6E5"],
    title: "Cold as balls",
    subtitle: "Do you want to build a snowman? Fuck no.",
    nameOfSong: "눈 오는 날 듣기 좋은 노래",
    youtubeLink: "",
  },
  Atmosphere: {
    iconName: "weather-hail",
    gradient: ["#89F7FE", "#66A6FF"],
    nameOfSong: "",
    youtubeLink: "",
  },
  Clear: {
    iconName: "weather-sunny",
    gradient: ["#FF7300", "#FEF253"],
    title: "Sunny as fuck",
    subtitle: "Go get your ass burnt",
    nameOfSong: "날씨 좋은 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%EB%82%A0%EC%94%A8+%EC%A2%8B%EC%9D%80%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Clouds: {
    iconName: "weather-cloudy",
    gradient: ["#D7D2CC", "#304352"],
    title: "Clouds",
    subtitle: "I know, fucking boring",
    nameOfSong: "흐린 날 듣기 좋은 노래",
    youtubeLink:
      "https://www.youtube.com/results?search_query=%ED%9D%90%EB%A6%B0+%EB%82%A0+%EB%93%A3%EA%B8%B0+%EC%A2%8B%EC%9D%80+%EB%85%B8%EB%9E%98",
  },
  Mist: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "Mist!",
    subtitle: "It's like you have no glasses on.",
    nameOfSong: "",
    youtubeLink: "",
  },
  Dust: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "Dusty",
    subtitle: "Thanks a lot China 🖕🏻",
    nameOfSong: "",
    youtubeLink: "",
  },
  Haze: {
    iconName: "weather-hail",
    gradient: ["#4DA0B0", "#D39D38"],
    title: "Haze",
    subtitle: "Just don't go outside.",
    nameOfSong: "",
    youtubeLink: "",
  },
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [country, setCountry] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
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
    setCountry(location[0].country);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);

    console.log(weatherOptions[days[0].weather[0].main].gradient[0]);
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
        <View>
          <Text>Today`s eve : {days[0].temp.eve}</Text>
          <Text>Today`s Max : {days[0].temp.max}</Text>
          <Text>Today`s Min : {days[0].temp.min}</Text>
          <Text>
            The name of weather :{" "}
            {weatherOptions[days[0].weather[0].main].title}
          </Text>
          <Text>
            Description of weather :{" "}
            {weatherOptions[days[0].weather[0].main].subtitle}
          </Text>
          <View style={styles.songOfToday}>
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
            <Text>듣기</Text>
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
