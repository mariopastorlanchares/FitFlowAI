import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';

import { effects, fonts, palette } from '@shared/constants/theme';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerHref: Href;
  children: React.ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  footerPrompt,
  footerLinkLabel,
  footerHref,
  children,
}: AuthShellProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const appName = t('common.appName');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            alignSelf: 'center',
            gap: 24,
          }}
        >
          <View style={{ gap: 18, alignItems: 'center' }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 999,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: palette.primaryBorder,
                backgroundColor: palette.primaryTintSoft,
              }}
            >
              <Text
                style={{
                  color: palette.primaryLight,
                  fontFamily: fonts.semiBold,
                  fontSize: 12,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {eyebrow}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  borderCurve: 'continuous',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: palette.surface,
                  borderWidth: 1,
                  borderColor: palette.borderSoft,
                }}
              >
                <Image
                  source={require('@/assets/images/fitflow_logo.png')}
                  style={{ width: 38, height: 38 }}
                  contentFit="contain"
                />
              </View>

              <View style={{ gap: 4 }}>
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontFamily: fonts.extraBold,
                    fontSize: 30,
                    letterSpacing: 0.2,
                  }}
                >
                  {appName}
                </Text>
                {title !== appName ? (
                  <Text
                    style={{
                      color: palette.primaryLight,
                      fontFamily: fonts.semiBold,
                      fontSize: 13,
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}
                  >
                    {title}
                  </Text>
                ) : null}
              </View>
            </View>

            <Text
              style={{
                color: palette.textSecondary,
                fontFamily: fonts.semiBold,
                fontSize: 16,
                lineHeight: 24,
                maxWidth: 360,
                textAlign: 'center',
              }}
            >
              {subtitle}
            </Text>
          </View>

          <View
            style={{
              padding: 22,
              borderRadius: 30,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: palette.borderSoft,
              backgroundColor: palette.surface,
              gap: 18,
              boxShadow: effects.authPanel,
            }}
          >
            {children}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            <Text
              style={{
                color: palette.textSecondary,
                fontFamily: fonts.regular,
                fontSize: 15,
              }}
            >
              {footerPrompt}
            </Text>
            <Link href={footerHref} asChild>
              <Pressable hitSlop={8}>
                <Text
                  style={{
                    color: palette.textPrimary,
                    fontFamily: fonts.bold,
                    fontSize: 15,
                  }}
                >
                  {footerLinkLabel}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
