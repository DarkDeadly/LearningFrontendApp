import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  variant = 'dark', // 👈 NEW: 'dark' | 'light'
  ...props
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isLight = variant === 'light';

  const COLORS = {
    text: isLight ? '#000000' : '#FFFFFF',
    placeholder: isLight ? '#6B7280' : '#FFFFFF',
    icon: error
      ? '#EF4444'
      : isFocused
      ? '#6366F1'
      : isLight
      ? '#000000'
      : '#FFFFFF',
    border: error
      ? '#EF4444'
      : isFocused
      ? '#6366F1'
      : '#E5E7EB',
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, { borderColor: COLORS.border }]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.icon}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[styles.input, { color: COLORS.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.text}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
    textAlign: 'right',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },

  icon: {
    marginHorizontal: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    textAlign: 'left',
  },

  eyeIcon: {
    padding: 4,
  },

  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    textAlign: 'right',
  },
});