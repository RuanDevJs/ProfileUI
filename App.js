import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import ICONS from './src/services/icons';
import SOCIAL from './src/services/social';

import { useFonts, Poppins_500Medium, Poppins_300Light } from '@expo-google-fonts/poppins';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolate, useDerivedValue } from 'react-native-reanimated';

const { height: SCREEEN_HEIGHT } = Dimensions.get('window');
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const scrollY = useSharedValue(300);
  const blur = useSharedValue(0);

  const context = useSharedValue({ y: 0 })

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_300Light
  });

  const transformY = useDerivedValue(() => {
    return withSpring(scrollY.value);
  })

  const gesture = Gesture.Pan()
  .onStart((event) => {
    context.value = {y: scrollY.value}
  })
  .onUpdate((event) => {
    scrollY.value = context.value.y + event.translationY;
    blur.value = (Math.max(scrollY.value.toFixed(0) / 8)).toFixed(0);
  })
  .onEnd((event) => {
    if(scrollY.value < 100 || scrollY.value < 200){
      scrollY.value = 300;
      return;
    }

    if(scrollY.value >= 400){
      scrollY.value = 500;
      return;
    }
  })

  const animatedHeader = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: transformY.value
        }
      ]
    }
  }) 
  const animatedProfileImage = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [100, 300, 400],
        [0, 1, 0],
        Extrapolate.CLAMP
      )
    }
  }) 

  if(!fontsLoaded){
    return (
      <View />
    )
  };

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject]}>
        <Animated.Image 
          source={{ uri: 'https://github.com/RuanDevJs.png'}}
          style={[StyleSheet.absoluteFillObject, animatedProfileImage]}
          blurRadius={12}
        />
      </View>
      <View style={{ position: 'absolute', top: 50, bottom: 0, justifyContent: 'flex-start'}}>
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <Animated.Image 
            source={{ uri: 'https://github.com/RuanDevJs.png'}}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <View style={{ paddingVertical: 12}}>
            <Text style={styles.title}>Ruan Vitor</Text>
            <Text style={styles.subtitle}>Desenvolvedor</Text>
          </View>
        </View>
        <View style={styles.productSocial}>
                <FlatList
                  data={SOCIAL}
                  renderItem={(({ item }) => {
                    return(
                      <View key={`icon:${item.name}`} style={styles.iconSocial}>
                        <Ionicons name={item.name} size={32} color={item.color} />
                      </View>
                    )
                  })}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
        </View>
      </View>
      <Animated.View style={[styles.menu, animatedHeader]}>
        <GestureHandlerRootView >
          <GestureDetector gesture={gesture}>
            <View>
              <View>
                <Text style={styles.subtitle}>Skills</Text>
              </View>
              <View style={styles.productMenu}>
                <FlatList
                  data={ICONS}
                  renderItem={(({ item }) => {
                    return(
                      <View key={`icon:${item.name}`} style={styles.icon}>
                        <Ionicons name={item.name} size={32} color={item.color} />
                        <Text style={styles.iconTitle}>{item.title}</Text>
                      </View>
                    )
                  })}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 32,
    resizeMode: 'cover'
  },
  profileInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
    color: "#333",
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    color: '#D1E2E5',
    textAlign: 'center'
  },
  productMenu:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  productSocial:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconSocial: {
    marginVertical: 12,
    marginHorizontal: 12,
    backgroundColor: "#f9f9f9",
    width: 50,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginVertical: 12,
    marginHorizontal: 12,
    backgroundColor: "#4A4355",
    width: 85,
    padding: 20,
    borderRadius: 4,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 5
    },  
    shadowColor: '#4A4355',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconTitle: {
    fontSize: 12,
    color: "#f9f9f9",
    marginTop: 4
  },
  menu: {
    backgroundColor: '#362F41',
    position: 'absolute',
    bottom: 0,
    top: 0,
    height: '100%',
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1000
  }
});
