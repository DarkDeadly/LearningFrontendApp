import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Button from './Button';
import InputField from './Input';

 const formFields = [
    {
      name: 'fullname',
      placeholder: 'أدخل اسمك الكامل',
      icon: 'person-outline',
    },
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
    {
      name: 'confirmPassword',
      placeholder: '••••••••',
      icon: 'lock-closed-outline',
      secureTextEntry: true,
    },
  ];

const RegisterForm = ({ formData, errors, onFieldChange, onSubmit, isLoading }) => {
   
  return (
    <Animated.View entering={FadeInDown.delay(350)} style={styles.form}>
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
        />
      ))}

      <Button
        title={isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        onPress={onSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.registerButton}
      />
    </Animated.View>
  );
}

export default RegisterForm

const styles = StyleSheet.create({
    form: {
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 8,
  },
})