export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6; // Same as backend
};

export const validateFullname = (fullname) => {
  return fullname.trim().length >= 2; // Same as backend
};

export const getLoginErrors = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!validateEmail(email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }

  if (!password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (!validatePassword(password)) {
    errors.password = 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل';
  }

  return errors;
};

export const getRegisterErrors = (fullname, email, password, confirmPassword) => {
  const errors = {};

  if (!fullname) {
    errors.fullname = 'الاسم الكامل مطلوب';
  } else if (!validateFullname(fullname)) {
    errors.fullname = 'الاسم يجب أن يحتوي على حرفين على الأقل';
  }

  if (!email) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!validateEmail(email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }

  if (!password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (!validatePassword(password)) {
    errors.password = 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'كلمتا المرور غير متطابقتين';
  }

  return errors;
};