export const validateCreateClassroom = (name,  pin) => {
  const errors = {};

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.name = 'اسم الفصل مطلوب';
  } else if (name.trim().length < 2) {
    errors.name = 'اسم الفصل يجب أن يحتوي على حرفين على الأقل';
  }

  // PIN validation
  if (!pin) {
    errors.pin = 'رمز PIN مطلوب';
  } else if (pin.length !== 4) {
    errors.pin = 'رمز PIN يجب أن يكون 4 أرقام';
  } else if (!/^\d{4}$/.test(pin)) {
    errors.pin = 'رمز PIN يجب أن يحتوي على أرقام فقط';
  }

  return errors;
};

export const validateJoinClassroom = (classroomId, pin) => {
  const errors = {};

  if (!classroomId) {
    errors.classroomId = 'معرف الفصل مطلوب';
  }

  if (!pin) {
    errors.pin = 'رمز PIN مطلوب';
  } else if (pin.length !== 4) {
    errors.pin = 'رمز PIN يجب أن يكون 4 أرقام';
  } else if (!/^\d{4}$/.test(pin)) {
    errors.pin = 'رمز PIN يجب أن يحتوي على أرقام فقط';
  }

  return errors;
};