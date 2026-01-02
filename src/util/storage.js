import AsyncStorage from "@react-native-async-storage/async-storage";


const KEYS = {
    ACCESS_TOKEN: 'accessToken',
    USER_DATA: 'userData',
};

export const storage = {
    // ========================================
    // ACCESS TOKEN METHODS
    // ========================================
    saveToken: async (token) => {
        try {
            await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
        } catch (error) {
            console.error("Error storing token:", error);
        }
    },

    getToken: async () => {
        try {
            return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    removeToken: async () => {
        try {
            await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    // ========================================
    // USER DATA METHODS
    // ========================================
    saveUserData: async (userData) => {
        try {
            await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
        } catch (error) {
            console.error("Error storing user data:", error);
        }
    },

    getUserData: async () => {
        try {
            const data = await AsyncStorage.getItem(KEYS.USER_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    removeUserData: async () => {
        try {
            await AsyncStorage.removeItem(KEYS.USER_DATA);
        } catch (error) {
            console.error('Error removing user data:', error);
        }
    },

    // ========================================
    // CLEAR ALL (for logout)
    // ========================================
    clearAll: async () => {
        try {
            await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.USER_DATA]);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
};
