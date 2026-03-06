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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider } from '@/components/ui/divider';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SocialButton } from '@/components/ui/social-button';
import { fonts, palette } from '@/constants/theme';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: call signIn from AuthContext
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
                {/* ── Logo + Title ── */}
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
                        FitFlow{' '}
                        <Text style={{ color: palette.primary }}>AI</Text>
                    </Text>
                </View>

                {/* ── Form Card with Blur ── */}
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
                    {/* ── Input Fields ── */}
                    <View style={{ gap: 14 }}>
                        <FormInput
                            icon="email-outline"
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoComplete="email"
                            textContentType="emailAddress"
                        />
                        <FormInput
                            icon="lock-outline"
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                            textContentType="password"
                        />
                    </View>

                    {/* ── CTA ── */}
                    <PrimaryButton label="Iniciar Sesión" onPress={handleLogin} />

                    {/* ── Social Login ── */}
                    <Divider label="O entra con" />

                    <View style={{ flexDirection: 'row', gap: 14 }}>
                        <SocialButton
                            provider="apple"
                            onPress={() => {/* TODO: Apple Sign-In */ }}
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
                            onPress={() => {/* TODO: Google Sign-In */ }}
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

                {/* ── Sign-up link ── */}
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
                        ¿Nuevo en FitFlow AI?
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
                                Regístrate
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
