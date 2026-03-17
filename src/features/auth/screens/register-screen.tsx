import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../hooks/use-auth';
import { isPasswordStrong } from '../utils/password';
import { fonts, palette } from '@shared/constants/theme';
import { getFirebaseErrorMessage } from '@shared/lib/i18n';
import { Divider } from '@shared/ui/divider';
import { FormInput } from '@shared/ui/form-input';
import { PrimaryButton } from '@shared/ui/primary-button';
import { SocialButton } from '@shared/ui/social-button';

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signUp } = useAuth();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError(t('register.errorEmptyFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('register.errorPasswordsDontMatch'));
      return;
    }

    if (!isPasswordStrong(password)) {
      setError(t('register.errorPasswordWeak'));
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await signUp(email, password);
      setSuccessMessage(t('register.emailVerificationSent'));
    } catch (err: any) {
      console.error('Register error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 20,
          gap: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              source={require('@/assets/images/fitflow_logo.png')}
              style={{ width: 56, height: 56 }}
              contentFit="contain"
            />
            <Text
              style={{
                fontSize: 40,
                fontFamily: fonts.extraBold,
                color: palette.textPrimary,
                letterSpacing: 0.3,
              }}
            >
              FitFlow <Text style={{ color: palette.primary }}>AI</Text>
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.semiBold,
              color: palette.textSecondary,
            }}
          >
            {t('common.createAccount')}
          </Text>
        </View>

        <BlurView
          intensity={40}
          tint="dark"
          style={{
            padding: 24,
            borderRadius: 36,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
            gap: 24,
          }}
        >
          <View style={{ gap: 14 }}>
            {successMessage ? (
              <View
                style={{
                  padding: 12,
                  backgroundColor: 'rgba(76, 175, 80, 0.15)',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: palette.success,
                }}
              >
                <Text
                  style={{
                    color: palette.success,
                    textAlign: 'center',
                    fontFamily: fonts.semiBold,
                  }}
                >
                  {t('register.successTitle')}
                </Text>
                <Text
                  style={{
                    color: palette.textSecondary,
                    textAlign: 'center',
                    marginTop: 4,
                    fontSize: 13,
                  }}
                >
                  {successMessage}
                </Text>
              </View>
            ) : null}

            {error ? (
              <Text
                style={{
                  color: palette.danger,
                  textAlign: 'center',
                  fontFamily: fonts.semiBold,
                }}
              >
                {error}
              </Text>
            ) : null}
            <FormInput
              icon="email-outline"
              placeholder={t('common.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <FormInput
              icon="lock-outline"
              placeholder={t('common.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="newPassword"
            />
            <FormInput
              icon="check-circle-outline"
              placeholder={t('common.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="newPassword"
            />
          </View>

          <PrimaryButton
            isLoading={isLoading}
            label={isLoading ? t('common.loading') : t('register.cta')}
            onPress={handleRegister}
          />

          <Divider label={t('common.orRegisterWith')} />

          <View style={{ flexDirection: 'row', gap: 14 }}>
            <SocialButton
              provider="apple"
              onPress={() => {}}
              icon={
                <MaterialCommunityIcons
                  name="apple"
                  size={26}
                  color={palette.textPrimary}
                />
              }
            />
            <SocialButton
              provider="google"
              onPress={() => {}}
              icon={
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: fonts.bold,
                    color: palette.primary,
                  }}
                >
                  G
                </Text>
              }
            />
          </View>
        </BlurView>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: palette.textSecondary,
              fontSize: 16,
              fontFamily: fonts.regular,
            }}
          >
            {t('register.hasAccountText')}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text
                style={{
                  color: palette.textPrimary,
                  fontSize: 15,
                  fontFamily: fonts.bold,
                }}
              >
                {t('register.hasAccountLink')}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
