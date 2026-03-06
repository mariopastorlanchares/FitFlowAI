import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { fonts, palette } from '@/constants/theme';
import { AuthContext } from '@/contexts/auth-context';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user, signOut } = useContext(AuthContext);
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert(t('common.error'), t('profile.logoutError'));
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: insets.top + 24,
                paddingBottom: 24,
                paddingHorizontal: 24,
                gap: 32,
            }}
            indicatorStyle="white"
        >
            {/* ── Header ── */}
            <View>
                <Text
                    style={{
                        fontSize: 32,
                        fontFamily: fonts.extraBold,
                        color: palette.textPrimary,
                    }}
                >
                    {t('profile.title')}
                </Text>
            </View>

            {/* ── User Info Card ── */}
            <View
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 24,
                    padding: 24,
                    gap: 16,
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: palette.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                    }}
                >
                    <MaterialCommunityIcons name="account" size={48} color={palette.textPrimary} />
                </View>

                <View style={{ alignItems: 'center', gap: 4 }}>
                    <Text
                        style={{
                            color: palette.textPrimary,
                            fontSize: 18,
                            fontFamily: fonts.bold,
                        }}
                    >
                        {t('profile.loggedUser')}
                    </Text>
                    <Text
                        style={{
                            color: palette.textSecondary,
                            fontSize: 14,
                            fontFamily: fonts.regular,
                        }}
                    >
                        {user?.email || t('profile.noEmail')}
                    </Text>
                </View>
            </View>

            {/* ── Logout Button ── */}
            <View style={{ marginTop: 'auto', paddingTop: 32 }}>
                <PrimaryButton
                    label={t('profile.logout')}
                    onPress={handleLogout}
                />
            </View>
        </ScrollView>
    );
}
