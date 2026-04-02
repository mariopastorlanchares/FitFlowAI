import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AuthShell } from '../components/auth-shell';
import { AuthStatusBanner } from '../components/auth-status-banner';
import { useAuth } from '../hooks/use-auth';
import { fonts, palette } from '@shared/constants/theme';
import { getFirebaseErrorMessage } from '@shared/lib/i18n';
import { Divider } from '@shared/ui/divider';
import { FormInput } from '@shared/ui/form-input';
import { PrimaryButton } from '@shared/ui/primary-button';
import { SocialButton } from '@shared/ui/social-button';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const { t } = useTranslation();
  const socialAuthUnavailable = t('common.socialAuthUnavailable');

  const updateEmail = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    if (error) {
      setError('');
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError(t('login.errorEmptyFields'));
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await signIn(trimmedEmail, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footerPrompt={t('login.noAccountText')}
      footerLinkLabel={t('login.noAccountLink')}
      footerHref="/(auth)/register"
    >
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
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
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
        {t('login.helper')}
      </Text>

      <PrimaryButton
        isLoading={isLoading}
        label={isLoading ? t('common.loading') : t('login.cta')}
        onPress={handleLogin}
      />

      <Divider label={t('common.orConnectWith')} />

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SocialButton
            provider="apple"
            label={t('common.apple')}
            onPress={() => {}}
            disabled
            accessibilityHint={socialAuthUnavailable}
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
            disabled
            accessibilityHint={socialAuthUnavailable}
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
        <Text
          style={{
            color: palette.textSecondary,
            fontFamily: fonts.regular,
            fontSize: 13,
            lineHeight: 18,
            textAlign: 'center',
          }}
        >
          {socialAuthUnavailable}
        </Text>
      </View>
    </AuthShell>
  );
}
