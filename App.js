import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

const API_KEY = "5448715390df41aed509eef3faa3053b";

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
    console.log(days[0].feels_like);
    console.log(location[0].country);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.country}>
        <Text style={styles.countryName}>{country}</Text>
      </View>
      {days.length === 0 ? (
        <Text>Loading Icon</Text>
      ) : (
        <View>
          <Text>Today`s eve : {days[0].temp.eve}</Text>
          <Text>Today`s Max : {days[0].temp.max}</Text>
          <Text>Today`s Min : {days[0].temp.min}</Text>
          <Text>The name of weather : {days[0].weather[0].main}</Text>
          <Text>Description of weather : {days[0].weather[0].description}</Text>
        </View>
      )}
    </View>
  );
}
// ㄹㅇ 커밋 됨?
// 삼항조건연산자로 로딩중일때와 실행 됐을때 페이지 제작
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
