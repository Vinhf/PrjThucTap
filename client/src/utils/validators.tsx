// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
};

export const validationFullname = (fullname: string): boolean => {
  return fullname.trim() !== "";
};

export const validationPhone = (phone: string): boolean => {
  const phoneRegex = /^[0][1-9]{1}[0-9]{8}$/; 
  return phoneRegex.test(phone);
};

export const validationSelection = (selection: string): boolean => {
  return selection.trim() !== "";
};


