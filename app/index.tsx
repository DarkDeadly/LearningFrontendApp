// app/index.js
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/anime-school-building-illustration.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "#000000"]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.content}>
              
              {/* Title and Subtitle Section */}
              <View style={styles.textContainer}>
                <Animated.Text 
                  entering={FadeInLeft} 
                  style={styles.welcomeText}
                >
                  مرحبا بك في
                </Animated.Text>
                
                <Animated.Text 
                  entering={FadeInLeft.delay(100)} 
                  style={styles.appTitle}
                >
                  نبض التواصل
                </Animated.Text>
                
                <Animated.Text 
                  entering={FadeInLeft.delay(300)} 
                  style={styles.subtitle}
                >
                  بالتواصل نصنع الفرق و بالمثابرة تتضاعف نقاطنا
                </Animated.Text>
              </View>

              {/* Buttons Section */}
              <View style={styles.buttonsContainer}>
                
                {/* Login Button */}
                <Animated.View entering={FadeInUp.delay(400)}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.loginButton,
                      pressed && styles.buttonPressed
                    ]}
                    onPress={() => router.push("/(auth)/Login")}
                    
                  >
                    <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
                  </Pressable>
                </Animated.View>

                {/* Register Button */}
                <Animated.View entering={FadeInUp.delay(500)}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.registerButton,
                      pressed && styles.buttonPressed
                    ]}
                    onPress={() => router.push("/(auth)/Register")}
                  >
                    <Text style={styles.registerButtonText}>إنشاء حساب</Text>
                  </Pressable>
                </Animated.View>

              </View>
            </View>
          </SafeAreaView>
          
          <StatusBar style="light" translucent backgroundColor="transparent" />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  
  // Text Container
  textContainer: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 48,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'right',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appTitle: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    lineHeight: 28,
    textAlign: 'right',
    paddingTop: 8,
    paddingBottom: 8,
  },
  
  // Buttons Container
  buttonsContainer: {
    gap: 16,
  },
  
  // Login Button (White background)
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Register Button (Outlined)
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  registerButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Pressed State
  buttonPressed: {
    opacity: 0.8,
  },
});