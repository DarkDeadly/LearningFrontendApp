// src/components/OptimizedImage.jsx
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

/**
 * Optimized image component with caching and loading states
 * Uses expo-image for better performance
 */
const OptimizedImage = ({
    source,
    width,
    height,
    style,
    contentFit = 'cover',
    placeholder = 'blur',
    ...props
}) => {
    return (
        <Image
            source={source}
            style={[
                { width, height },
                style
            ]}
            contentFit={contentFit}
            placeholder={placeholder}
            transition={200}
            {...props}
        />
    );
};

export default OptimizedImage;

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
    },
});
