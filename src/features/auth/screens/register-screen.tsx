import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AuthShell } from '../components/auth-shell';
import { AuthStatusBanner } from '../components/auth-status-banner';
import { useAuth } from '../hooks/use-auth';
import { isPasswordStrong } from '../utils/password';
import { fonts, palette } from '@shared/constants/theme';
import { getFirebaseErrorMessage } from '@shared/lib/i18n';
import { Divider } from '@shared/ui/divider';
import { FormInput } from '@shared/ui/form-input';
import { PrimaryButton } from '@shared/ui/primary-button';
import { SocialButton } from '@shared/ui/social-button';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signUp } = useAuth();
  const { t } = useTranslation();

  const updateEmail = (value: string) => {
    setEmail(value);
    setSuccessMessage('');
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    setSuccessMessage('');
  };

  const updateConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    setSuccessMessage('');
  };

  const handleRegister = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      setSuccessMessage('');
      setError(t('register.errorEmptyFields'));
      return;
    }

    if (password !== confirmPassword) {
      setSuccessMessage('');
      setError(t('register.errorPasswordsDontMatch'));
      return;
    }

    if (!isPasswordStrong(password)) {
      setSuccessMessage('');
      setError(t('register.errorPasswordWeak'));
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await signUp(trimmedEmail, password);
      setSuccessMessage(t('register.emailVerificationSent'));
    } catch (err: any) {
      console.error('Register error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={t('register.eyebrow')}
      title={t('common.createAccount')}
      subtitle={t('register.subtitle')}
      footerPrompt={t('register.hasAccountText')}
      footerLinkLabel={t('register.hasAccountLink')}
      footerHref="/(auth)/login"
    >
      {successMessage ? (
        <AuthStatusBanner
          kind="success"
          title={t('register.successTitle')}
          body={successMessage}
        />
      ) : null}

      {error ? <AuthStatusBanner kind="error" body={error} /> : null}

      <View style={{ gap: 14 }}>
        <FormInput
          icon="email-outline"
          label={t('common.emailLabel')}
          placeholder={t('common.emailPlaceholder')}
          value={email}
          onChangeText={updateEmail}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          autoFocus
        />
        <FormInput
          icon="lock-outline"
          label={t('common.passwordLabel')}
          placeholder={t('common.passwordPlaceholder')}
          value={password}
          onChangeText={updatePassword}
          secureTextEntry
          autoComplete="password"
          textContentType="newPassword"
          returnKeyType="next"
        />
        <FormInput
          icon="check-circle-outline"
          label={t('common.confirmPasswordLabel')}
          placeholder={t('common.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChangeText={updateConfirmPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
      </View>

      <Text
        style={{
          color: palette.textSecondary,
          fontFamily: fonts.regular,
          fontSize: 14,
          lineHeight: 20,
          textAlign: 'center',
        }}
      >
        {t('register.helper')}
      </Text>

      <PrimaryButton
        isLoading={isLoading}
        label={isLoading ? t('common.loading') : t('register.cta')}
        onPress={handleRegister}
      />

      <Divider label={t('common.orRegisterWith')} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SocialButton
          provider="apple"
          label={t('common.apple')}
          onPress={() => {}}
          icon={
            <MaterialCommunityIcons
              name="apple"
              size={20}
              color={palette.textPrimary}
            />
          }
        />
        <SocialButton
          provider="google"
          label={t('common.google')}
          onPress={() => {}}
          icon={
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.bold,
                color: palette.primary,
              }}
            >
              G
            </Text>
          }
        />
      </View>
    </AuthShell>
  );
}
