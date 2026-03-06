import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, palette } from '@/constants/theme';
import { Image } from 'expo-image';

interface DashboardCardProps {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    title: string;
    subtitle?: string;
    onPress: () => void;
}

function DashboardCard({ icon, title, subtitle, onPress }: DashboardCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                flex: 1,
                aspectRatio: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 24,
                borderCurve: 'continuous',
                padding: 16,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                opacity: pressed ? 0.7 : 1,
            })}
        >
            <MaterialCommunityIcons name={icon} size={48} color={palette.primary} />
            <View style={{ alignItems: 'center', gap: 4 }}>
                <Text
                    style={{
                        color: palette.textPrimary,
                        fontSize: 14,
                        fontFamily: fonts.semiBold,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        textAlign: 'center',
                    }}
                >
                    {title}
                </Text>
                {subtitle && (
                    <Text
                        style={{
                            color: palette.textSecondary,
                            fontSize: 12,
                            fontFamily: fonts.regular,
                            textAlign: 'center',
                        }}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

export default function DashboardScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: insets.top + 20,
                paddingBottom: 24,
                paddingHorizontal: 24,
                gap: 32,
            }}
            indicatorStyle="white"
        >
            {/* ── Header App ── */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                    source={require('@/assets/images/fitflow_logo.png')}
                    style={{ width: 32, height: 32 }}
                    contentFit="contain"
                />
                <Text
                    style={{
                        fontSize: 24,
                        fontFamily: fonts.extraBold,
                        color: palette.textPrimary,
                        letterSpacing: 0.2,
                    }}
                >
                    FitFlow <Text style={{ color: palette.primary }}>AI</Text>
                </Text>
            </View>

            {/* ── Seccción Entrenamiento Actual ── */}
            <View style={{ gap: 8 }}>
                <Text
                    style={{
                        color: palette.textSecondary,
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                    }}
                >
                    Tu entrenamiento:
                </Text>
                <Text
                    style={{
                        color: palette.textPrimary,
                        fontSize: 28,
                        fontFamily: fonts.bold,
                    }}
                >
                    DÍA 1 EMPUJE
                </Text>
            </View>

            {/* ── Grid Modular ── */}
            <View style={{ gap: 16 }}>
                {/* Fila 1 */}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <DashboardCard
                        icon="arm-flex"
                        title="Músculo Hoy"
                        subtitle="Hombro Focus"
                        onPress={() => { }}
                    />
                    <DashboardCard
                        icon="chart-timeline-variant-shimmer"
                        title="Estadísticas"
                        onPress={() => { }}
                    />
                </View>

                {/* Fila 2 */}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <DashboardCard
                        icon="brain"
                        title="Tip AI"
                        onPress={() => { }}
                    />
                    <DashboardCard
                        icon="account-circle-outline"
                        title="Perfil"
                        onPress={() => { }}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
