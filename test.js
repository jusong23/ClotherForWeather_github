<ScrollView
  horizontal
  showsHorizontalScrollIndicator={"false"}
  pagingEnabled
  contentContainerStyle={styles.weather}
>
  {hours.length === 0 ? (
    <View style={{ ...styles.day, alignItems: "center" }}>
      <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
    </View>
  ) : (
    hours.map((hour, index) => (
      <View key={index} style={styles.day}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Text style={styles.temp}></Text>
          {/* <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                /> */}
        </View>
      </View>
    ))
  )}
</ScrollView>;
