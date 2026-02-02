// src/hooks/useNetworkStatus.js
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Hook to detect network connectivity status
 * @returns {object} { isConnected, isInternetReachable, type }
 */
export const useNetworkStatus = () => {
    const [networkState, setNetworkState] = useState({
        isConnected: true,
        isInternetReachable: true,
        type: 'unknown',
    });

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable ?? true,
                type: state.type,
            });
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    return networkState;
};

/**
 * Hook to check if device is online
 * @returns {boolean} true if connected to internet
 */
export const useIsOnline = () => {
    const { isConnected, isInternetReachable } = useNetworkStatus();
    return isConnected && isInternetReachable;
};
