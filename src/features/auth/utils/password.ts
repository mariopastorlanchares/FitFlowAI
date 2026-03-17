const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export function isPasswordStrong(password: string) {
  return PASSWORD_PATTERN.test(password);
}
