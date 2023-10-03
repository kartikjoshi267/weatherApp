import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import theme from "../theme/index.js";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  fetchLocations,
  fetchWeatherForecast,
} from "../api/weather.js";
import { debounce, set } from "lodash";
import dummyData from "../dummyData/";
import { weatherImages } from "../constants/index.js";
import { getData, storeData } from "../asyncStorage/index.js";

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(dummyData);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLocation = (location) => {
    setLoading(true);
    setToggleSearch(false);
    fetchWeatherForecast({
      cityName: location.name,
      days: 7,
    }).then((data) => {
      setCurrentLocation(data);
    });
    setLoading(false);
    storeData("city", location.name);
    setLocations([]);
  };

  const fetchMyWeatherData = async () => {
    setLoading(true);
    try {
      let cityName = "New Delhi";
      let storedCity = await getData("city");
      if (storedCity){
        console.log(storedCity);
        cityName = storedCity;
      }

      fetchWeatherForecast({
        cityName: cityName,
        days: 7,
      }).then((data) => {
        setCurrentLocation(data);
      });
      storeData("city", cityName);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setLocations([]);
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const handleSearch = (search) => {
    if (search !== "") {
      fetchLocations({ cityName: search }).then((res) => setLocations(res));
    } else {
      setLocations([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // const Menu = () => (
  //   <View style={[tw`flex-row h-full`]}>
  //     <Image
  //       blurRadius={10}
  //       source={require("../assets/images/bg_new.jpg")}
  //       style={[tw`absolute h-full w-full`]}
  //     />
  //     <View style={[tw`h-full w-full justify-start`]}>
  //       <View style={[tw`h-32 w-full justify-end mb-2`, { backgroundColor: '#033e3d' }]}>
  //         <Text style={[tw`font-bold text-white text-3xl`]}>Weather App</Text>
  //       </View>
  //       <View style={[tw`flex-col`]}>
  //         {[1,2,3,4].map((val, index) => (
  //           <>
  //             <TouchableOpacity key={index} style={[tw`py-4 px-2`]}>
  //               <Text style={[tw`text-white`]}>{val}</Text>
  //             </TouchableOpacity>
  //           </>
  //         ))}
  //       </View>
  //     </View>
  //   </View>
  // );

  return (
    <>
      {/* <SideMenu menu={<Menu />} isOpen={true}> */}
      <View style={[tw`h-full flex-1 relative`]}>
        <StatusBar barStyle="light-content" />
        <Image
          blurRadius={90}
          source={require("../assets/images/bg_new.jpg")}
          style={[tw`absolute h-full w-full`]}
        />
        {loading ? (
          <View style={[tw`flex-1 flex-row justify-center items-center`]}>
            <ActivityIndicator size={100} color={"#0bb3b2"} />
          </View>
        ) : (
          <SafeAreaView style={[tw`flex flex-1`]}>
            <View style={[{ height: "7%" }, tw`mx-4 relative z-50`]}>
              <View
                style={[
                  {
                    backgroundColor: toggleSearch
                      ? theme.bgWhite(0.2)
                      : "transparent",
                  },
                  tw`flex-row justify-end items-center rounded-full`,
                ]}
              >
                {/* <Text>Hello</Text> */}
                {toggleSearch ? (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search city"
                    placeholderTextColor={"lightgray"}
                    style={[tw`pl-6 h-10 pb-1 flex-1 text-base text-white`]}
                  />
                ) : null}
                <TouchableOpacity
                  onPress={() => {
                    setLocations([]);
                    setToggleSearch(!toggleSearch);
                  }}
                  style={[
                    { backgroundColor: theme.bgWhite(0.3) },
                    tw`rounded-full p-3 m-1`,
                  ]}
                >
                  <Icon name="search" size={15} color={theme.bgWhite(1)} />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && toggleSearch ? (
                <View
                  style={[
                    { backgroundColor: theme.bgWhite(0.93) },
                    tw`absolute w-full top-16 rounded-3xl`,
                  ]}
                >
                  {locations.slice(0, 3).map((location, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocation(location)}
                        key={index}
                        style={[
                          tw`flex-row items-center border-0 p-3 px-4 mb-1 ${
                            index !== locations.length - 1
                              ? "border-b-2 border-gray-400"
                              : ""
                          }`,
                        ]}
                      >
                        <Icon name="map-marker" size={25} color={"gray"} />
                        <Text style={[tw`text-black text-lg ml-2`]}>
                          {location.name}, {location.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/* Forecast Section */}
            <View style={[tw`mx-4 flex justify-around flex-1`]}>
              {/* location details */}
              <Text style={[tw`text-white text-center text-2xl font-bold`]}>
                {currentLocation?.location?.name},{" "}
                <Text style={[tw`text-gray-300 text-lg font-semibold`]}>
                  {currentLocation?.location?.country}
                </Text>
              </Text>

              {/* weather image */}
              <View style={[tw`flex-row justify-center`]}>
                <Image
                  style={[tw`h-40 w-40`]}
                  source={weatherImages[currentLocation?.current?.condition?.text]}
                />
              </View>
            </View>

            {/* degree celsius */}
            <View style={[tw`mb-10`]}>
              <Text
                style={[
                  { fontSize: 60 },
                  tw`text-center font-bold text-white ml-5`,
                ]}
              >
                {currentLocation?.current?.temp_c}&#176;
              </Text>
              <Text
                style={[
                  { fontSize: 20 },
                  tw`text-center font-bold text-white ml-5`,
                ]}
              >
                {currentLocation?.current?.condition?.text}
              </Text>
            </View>

            {/* Other stats */}
            <View style={[tw`flex-row justify-between mx-4`]}>
              <View style={[tw`flex-row items-center`]}>
                <Image
                  source={require("../assets/icons/wind.png")}
                  style={[tw`h-6 w-6`]}
                />
                <Text style={[tw`text-white font-semibold text-base ml-2`]}>
                  {currentLocation?.current?.wind_kph} kmph
                </Text>
              </View>
              <View style={[tw`flex-row items-center`]}>
                <Image
                  source={require("../assets/icons/drop.png")}
                  style={[tw`h-6 w-6`]}
                />
                <Text style={[tw`text-white font-semibold text-base ml-2`]}>
                  {currentLocation?.current?.humidity}%
                </Text>
              </View>
              <View style={[tw`flex-row items-center`]}>
                <Image
                  source={require("../assets/icons/sun.png")}
                  style={[tw`h-6 w-6`]}
                />
                <Text style={[tw`text-white font-semibold text-base ml-2`]}>
                  {currentLocation?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>

            {/* Forecast for next days */}
            <View style={[tw`mt-4 mb-2`]}>
              <View
                style={[
                  tw`flex-row items-center mx-4 mt-4 mb-2 justify-start items-center`,
                ]}
              >
                <Icon name="calendar" size={20} color={"white"} />
                <Text style={[tw`text-white ml-3`]}>Daily Forecast</Text>
              </View>

              <ScrollView
                horizontal={true}
                contentContainerStyle={[tw`w-full flex-row justify-center`]}
              >
                {currentLocation?.forecast?.forecastday?.map((day, index) => (
                  <View
                    key={index}
                    style={[
                      { backgroundColor: theme.bgWhite(0.1) },
                      tw`my-2 flex-col mx-2 justify-start items-center p-4 w-24 rounded-3xl`,
                    ]}
                  >
                    <Image
                      source={weatherImages[day.day.condition.text]}
                      style={[tw`h-11 w-11`]}
                    />
                    <Text style={[tw`text-white text-xs`]}>
                      {
                        new Date(day.date)
                          .toLocaleDateString("en-US", { weekday: "long" })
                          .split(",")[0]
                      }
                    </Text>
                    <Text style={[tw`text-white text-xl font-semibold`]}>
                      {day.day.avgtemp_c}&#176;
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </View>
      {/* </SideMenu> */}
    </>
  );
};

export default HomeScreen;
