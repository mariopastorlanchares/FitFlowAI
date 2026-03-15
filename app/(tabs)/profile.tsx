import { ConfirmModal } from '@shared/ui/confirm-modal';
import { palette } from '@shared/constants/theme';
import { auth } from '@shared/lib/firebase';
import { signOut } from 'firebase/auth';
import { ChevronRight, CircleHelp, Globe, LogOut, Settings, Shield, User as UserIcon } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { t } = useTranslation();
    const user = auth.currentUser;
    const userEmail = user?.email || t('profile.noEmail');

    const [isLogoutVisible, setIsLogoutVisible] = useState(false);

    const handleLogout = () => {
        setIsLogoutVisible(true);
    };

    const confirmLogout = async () => {
        setIsLogoutVisible(false);
        try {
            await signOut(auth);
        } catch (error) {
            Alert.alert(t('common.error'), t('profile.logoutError'));
        }
    };

    const renderOption = (icon: React.ReactNode, title: string, hasTopBorder = true) => (
        <TouchableOpacity style={[styles.optionContainer, hasTopBorder && styles.optionBorder]}>
            <View style={styles.optionLeft}>
                {icon}
                <Text style={styles.optionText}>{title}</Text>
            </View>
            <ChevronRight size={20} color={palette.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <UserIcon size={40} color={palette.background} />
                    </View>
                    <Text style={styles.title}>{t('profile.title')}</Text>
                    <Text style={styles.emailText}>{userEmail}</Text>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('profile.sections.account')}</Text>
                    <View style={styles.card}>
                        {renderOption(
                            <UserIcon size={20} color={palette.textPrimary} />,
                            t('profile.options.personalInfo'),
                            false
                        )}
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('profile.sections.preferences')}</Text>
                    <View style={styles.card}>
                        {renderOption(
                            <Settings size={20} color={palette.textPrimary} />,
                            t('profile.options.theme'),
                            false
                        )}
                        {renderOption(
                            <Globe size={20} color={palette.textPrimary} />,
                            t('profile.options.language')
                        )}
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('profile.sections.support')}</Text>
                    <View style={styles.card}>
                        {renderOption(
                            <CircleHelp size={20} color={palette.textPrimary} />,
                            t('profile.options.help'),
                            false
                        )}
                        {renderOption(
                            <Shield size={20} color={palette.textPrimary} />,
                            t('profile.options.privacy')
                        )}
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color={palette.danger} />
                    <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                </TouchableOpacity>

                {/* Version Spacer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            <ConfirmModal
                visible={isLogoutVisible}
                title={t('profile.logoutConfirmTitle')}
                message={t('profile.logoutConfirmMessage')}
                cancelText={t('profile.logoutCancel')}
                confirmText={t('profile.logoutConfirm')}
                onCancel={() => setIsLogoutVisible(false)}
                onConfirm={confirmLogout}
                isDestructive={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: palette.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        color: palette.textPrimary,
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        marginBottom: 4,
    },
    emailText: {
        color: palette.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: palette.textSecondary,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: palette.surface,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.border,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    optionBorder: {
        borderTopWidth: 1,
        borderTopColor: palette.border,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionText: {
        color: palette.textPrimary,
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: palette.surface,
        borderRadius: 16,
        paddingVertical: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: palette.border,
    },
    logoutText: {
        color: palette.danger,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
    },
    bottomSpacer: {
        height: 40,
    }
});
