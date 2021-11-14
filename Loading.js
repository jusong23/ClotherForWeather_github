import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const loadingMent = [
  "과거에서 교훈을 얻을 수는 있어도 과거 속에 살 수는 없다.",
  "미래를 예측하는 최선의 방법은 미래를 창조하는 것이다.",
  "낭비한 시간에 대한 후회는 더 큰 시간 낭비이다.",
  "경험을 현명하게 사용한다면, 어떤 일도 시간 낭비는 아니다.",
  "유행은 유행에 뒤떨어질 수 밖에 없게 만들어진다.",
  "이 사악한 세상에서 영원한 것은 없다. 우리가 겪는 어려움조차도.",
  "미래는 현재 우리가 무엇을 하는가에 달려 있다.",
  "미래는 탁한 거울이다. 누구든 들여다 보려 하면 늙고 근심 어린 얼굴의 희미한 윤곽만 볼 뿐이다.",
  "태양이 사라졌다고 생각하는 순간, 한 줄기의 빛이 내게 비춰졌다.",
  "희망을 품지 않은 자는 절망도 할 수 없다.",
];

const great = [
  "-린든 B. 존슨",
  "-알랜 케이",
  "-메이슨 쿨리",
  "-오귀스트 르네 로댕",
  "-가브리엘 샤넬",
  "-찰리 채플린",
  "-마하트마 간디",
  "-짐 비숍",
  "-커트 코베인",
  "-조지 버나드 쇼",
];

export default function App() {
  return (
    <View style={styles.loading}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={["#7DE2FC", "#B9B6E5"]} style={styles.container}>
        <View style={styles.mainBox}>
          <ActivityIndicator
            color="black"
            style={{ marginTop: 10 }}
            size="large"
          />
          <Text style={styles.loading__text}>
            {loadingMent[Math.floor(Math.random() * 10)]}
          </Text>
          <View style={styles.rightSort}>
            <Text style={styles.great__text}>
              {great[Math.floor(Math.random() * 10)]}
            </Text>
            <View></View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#00000000",
  },
  loading__text: {
    justifyContent: "center",
    marginTop: 30,
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  great__text: {
    marginRight: 7,
    fontWeight: "400",
  },
  rightSort: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mainBox: {
    width: "90%",
    marginTop: 30,
  },
});
