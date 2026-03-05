import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, palette } from '@/constants/theme';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureEntry, setSecureEntry] = useState(true);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 28,
                    paddingTop: insets.top + 40,
                    paddingBottom: insets.bottom + 24,
                    gap: 28,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Logo + Title ── */}
                <View style={{ alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={{ width: 64, height: 64 }}
                        contentFit="contain"
                    />
                    <Text
                        style={{
                            fontSize: 34,
                            fontWeight: '800',
                            color: palette.textPrimary,
                            letterSpacing: 0.5,
                        }}
                    >
                        FitFlow AI
                    </Text>
                </View>

                {/* ── Input Fields ── */}
                <View style={{ gap: 16 }}>
                    {/* Email */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: palette.inputBackground,
                            borderWidth: 1,
                            borderColor: palette.inputBorder,
                            borderRadius: 14,
                            borderCurve: 'continuous',
                            paddingHorizontal: 16,
                            height: 56,
                            gap: 12,
                        }}
                    >
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={20}
                            color={palette.textSecondary}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                color: palette.textPrimary,
                                fontSize: 16,
                            }}
                            placeholder="Correo electrónico"
                            placeholderTextColor={palette.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                        />
                    </View>

                    {/* Password */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: palette.inputBackground,
                            borderWidth: 1,
                            borderColor: palette.inputBorder,
                            borderRadius: 14,
                            borderCurve: 'continuous',
                            paddingHorizontal: 16,
                            height: 56,
                            gap: 12,
                        }}
                    >
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={20}
                            color={palette.textSecondary}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                color: palette.textPrimary,
                                fontSize: 16,
                            }}
                            placeholder="Contraseña"
                            placeholderTextColor={palette.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secureEntry}
                            autoCapitalize="none"
                            autoComplete="password"
                            textContentType="password"
                        />
                        <Pressable
                            onPress={() => setSecureEntry((prev) => !prev)}
                            hitSlop={8}
                        >
                            <MaterialCommunityIcons
                                name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color={palette.textSecondary}
                            />
                        </Pressable>
                    </View>
                </View>

                {/* ── CTA Button ── */}
                <Pressable
                    onPress={() => {
                        // TODO: call signIn from AuthContext
                    }}
                    style={({ pressed }) => ({
                        borderRadius: 30,
                        borderCurve: 'continuous',
                        overflow: 'hidden',
                        height: 56,
                        borderWidth: 1.5,
                        borderColor: '#3D2200',
                        opacity: pressed ? 0.85 : 1,
                        boxShadow: '0 4px 28px rgba(255, 140, 0, 0.55), 0 0 12px rgba(255, 180, 0, 0.3)',
                    })}
                >
                    <LinearGradient
                        colors={['#FFC020', '#FFA010', '#F08000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 18,
                                fontFamily: fonts.black,
                                letterSpacing: 1.2,
                                textTransform: 'uppercase',
                            }}
                        >
                            Iniciar Sesión
                        </Text>
                    </LinearGradient>
                </Pressable>

                {/* ── Divider "O entra con" ── */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: palette.border,
                        }}
                    />
                    <Text
                        style={{
                            color: palette.textSecondary,
                            fontSize: 14,
                        }}
                    >
                        O entra con
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: palette.border,
                        }}
                    />
                </View>

                {/* ── Social Login Buttons ── */}
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 16,
                    }}
                >
                    {/* Apple */}
                    <Pressable
                        onPress={() => {
                            // TODO: Apple Sign-In
                        }}
                        style={({ pressed }) => ({
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 52,
                            borderRadius: 28,
                            borderCurve: 'continuous',
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            backgroundColor: pressed
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'transparent',
                            gap: 8,
                        })}
                    >
                        <MaterialCommunityIcons
                            name="apple"
                            size={24}
                            color={palette.textPrimary}
                        />
                    </Pressable>

                    {/* Google */}
                    <Pressable
                        onPress={() => {
                            // TODO: Google Sign-In
                        }}
                        style={({ pressed }) => ({
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 52,
                            borderRadius: 28,
                            borderCurve: 'continuous',
                            borderWidth: 1,
                            borderColor: palette.primary,
                            backgroundColor: pressed
                                ? 'rgba(255, 140, 0, 0.1)'
                                : 'transparent',
                            gap: 8,
                        })}
                    >
                        <MaterialCommunityIcons
                            name="google"
                            size={24}
                            color={palette.primary}
                        />
                    </Pressable>
                </View>

                {/* ── Sign-up link ── */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 4,
                        marginTop: 8,
                    }}
                >
                    <Text style={{ color: palette.textSecondary, fontSize: 14 }}>
                        ¿Nuevo en FitFlow AI?
                    </Text>
                    <Link href="/(auth)/login" asChild>
                        <Pressable>
                            <Text
                                style={{
                                    color: palette.textPrimary,
                                    fontSize: 14,
                                    fontWeight: '700',
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
