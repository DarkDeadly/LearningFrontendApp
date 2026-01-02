// src/components/LoginForm.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Button from '../Button';
import InputField from '../Input';



const LoginForm = React.memo(({ 
  formData, 
  errors, 
  onFieldChange, 
  onSubmit, 
  isLoading 
}) => {
  const formFields = [
    {
      name: 'email',
      placeholder: 'example@email.com',
      icon: 'mail-outline',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      name: 'password',
      placeholder: '••••••••',
      icon: 'lock-closed-outline',
      secureTextEntry: true,
    },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.form}>
      {formFields.map((field) => (
        <InputField
          key={field.name}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChangeText={(value) => onFieldChange(field.name, value)}
          error={errors[field.name]}
          icon={field.icon}
          keyboardType={field.keyboardType}
          autoCapitalize={field.autoCapitalize}
          secureTextEntry={field.secureTextEntry}
          theme="dark"
        />
      ))}

      {/* Forgot Password Link (Optional) */}
      <TouchableOpacity 
        style={styles.forgotPassword}
        activeOpacity={0.7}
      >
        <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
      </TouchableOpacity>

      <Button
        title={isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        onPress={onSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.loginButton}
      />
    </Animated.View>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;

const styles = StyleSheet.create({
  form: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: 8,
  },
});