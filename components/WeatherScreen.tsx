import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  TextInput,
  SafeAreaView,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";

const BASE_URL = `http://api.openweathermap.org/data/2.5`;
const O_W_KEY = "a0dde078af92e4c2dd9a19f98c5d5071";

type TMainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};

type TWeather = {
  name: string;
  main: TMainWeather;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
};

type TGeoCoords = {
  lat: number;
  lon: number;
};

export type TWeatherForecast = {
  main: TMainWeather;
  dt: number;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
};

const WeatherScreen = () => {
  const [location, setLocation] = useState<TGeoCoords>();
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState<TWeather>();
  const [forecast, setForecast] = useState<TWeatherForecast[]>();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const fetchWeather = async () => {
    if (!location) {
      return;
    }
    const results = await fetch(
      `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${O_W_KEY}&units=metric`
    );
    const data = await results.json();
    setWeather(data);
  };

  const fetchForecast = async () => {
    if (!location) {
      return;
    }
    const results = await fetch(
      `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${O_W_KEY}&units=metric`
    );
    const data = await results.json();
    setForecast(data.list);
  };

  const getPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("No permissions for location service!");
      console.log(errorMsg);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 3000,
    });
    const coords: TGeoCoords = {
      lat: loc.coords.latitude,
      lon: loc.coords.longitude,
    };
    setLocation(coords);
    console.log("Location coords: ", coords);
  };

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
    }
  }, [location]);

  useEffect(() => {
    getPosition();
  }, []);

  const handlePress = () => {
    const coords: TGeoCoords = {
      lat: parseFloat(latitude),
      lon: parseFloat(longitude),
    };
    setLocation(coords);
  };

  const filterForecast = () => {
    if (!forecast) {
      return [];
    }
    const today = new Date();
    const filtered = forecast.filter((item) => {
      const date = new Date(item.dt * 1000);
      return (
        date.getHours() === 12 &&
        [0, 1, 2, 3].includes(date.getDate() - today.getDate())
      );
    });
    return filtered.slice(0, 3);
  };

  const renderForecastItem = ({ item }: { item: TWeatherForecast }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDate}>
        {new Date(item.dt * 1000).toLocaleDateString()}
        {"\n"}
        <Text style={styles.forecastDate}>
          {new Date(item.dt * 1000).getHours()}:00
        </Text>
      </Text>
      <LottieView
        source={
          item.weather[0].main === "Rain"
            ? require("../assets/lottie/rain.json")
            : require("../assets/lottie/sunny.json")
        }
        style={styles.lottieForecastPicture}
        loop
        autoPlay
      />
      <Text style={styles.forecastTemp}>{Math.ceil(item.main.temp)}°C</Text>
    </View>
  );

  if (!weather) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
    >
      <View style={styles.imgBackground} />
      <SafeAreaView style={styles.parameters}>
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
        />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Press me</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.weatherParams}>
        <Text style={styles.location}>{weather.name}</Text>
        <LottieView
          source={
            weather.weather[0].main === "Rain"
              ? require("../assets/lottie/rain.json")
              : require("../assets/lottie/sunny.json")
          }
          style={styles.lottiePicture}
          loop
          autoPlay
        />
        <Text style={styles.tempText}>{Math.ceil(weather.main.temp)}°C</Text>
      </View>
      <FlatList
        horizontal
        data={filterForecast()}
        renderItem={renderForecastItem}
        keyExtractor={(item) => item.dt.toString()}
        style={styles.forecastList}
      />
      <StatusBar style="light" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  location: {
    fontSize: 30,
    color: "lightgray",
  },
  imgBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  weatherParams: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: 80,
  },
  lottiePicture: {
    width: 150,
    aspectRatio: 1,
  },
  tempText: {
    color: "lightgray",
    fontSize: 50,
  },
  input: {
    backgroundColor: "white",
    height: 40,
    width: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  parameters: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "orange",
    margin: 12,
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  forecastList: {
    position: "absolute",
    bottom: 20,
  },
  forecastItem: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
    width: 110,
  },
  forecastDate: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
  },
  lottieForecastPicture: {
    width: 100,
    aspectRatio: 1,
  },
  forecastTemp: {
    fontSize: 20,
    color: "black",
  },
});

export default WeatherScreen;
