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
import { fonts, palette } from '@shared/constants/theme';
import { getFirebaseErrorMessage } from '@shared/lib/i18n';
import { Divider } from '@shared/ui/divider';
import { FormInput } from '@shared/ui/form-input';
import { PrimaryButton } from '@shared/ui/primary-button';
import { SocialButton } from '@shared/ui/social-button';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('login.errorEmptyFields'));
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await signIn(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 32,
          }}
        >
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
            {error ? (
              <Text style={{ color: palette.danger, textAlign: 'center' }}>{error}</Text>
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
              textContentType="password"
            />
          </View>

          <PrimaryButton
            isLoading={isLoading}
            label={isLoading ? t('common.loading') : t('login.cta')}
            onPress={handleLogin}
          />

          <Divider label={t('common.orConnectWith')} />

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
            {t('login.noAccountText')}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text
                style={{
                  color: palette.textPrimary,
                  fontSize: 15,
                  fontFamily: fonts.bold,
                }}
              >
                {t('login.noAccountLink')}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
