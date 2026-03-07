import { fonts, palette } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LOCATIONS = ['Gimnasio', 'Casa', 'Calle', 'Parque'];
const DURATIONS = ['30 min', '45 min', '60 min', '90 min'];
const ENERGIES = ['🔋 Agotado', '⚡ Normal', '🔥 A Tope'];

export function WorkoutContextSelector() {
    const { t } = useTranslation();

    // Valores por defecto restaurados para que se vean cerrados
    const [selectedLocation, setSelectedLocation] = useState<string | null>('Gimnasio');
    const [selectedDuration, setSelectedDuration] = useState<string | null>('45 min');
    const [selectedEnergy, setSelectedEnergy] = useState<string | null>('⚡ Normal');

    // Solo el primero abierto por defecto
    const [isLocationOpen, setIsLocationOpen] = useState(true);
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const [isEnergyOpen, setIsEnergyOpen] = useState(false);

    const toggleSection = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setter(!value);
    };

    const handleSelectLocation = (loc: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedLocation(loc);
        setIsLocationOpen(false);
        // Si no se ha elegido tiempo, lo abrimos automáticamente
        if (!selectedDuration) {
            setIsDurationOpen(true);
        }
    };

    const handleSelectDuration = (dur: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedDuration(dur);
        setIsDurationOpen(false);
        // Si no se ha elegido energía, la abrimos automáticamente
        if (!selectedEnergy) {
            setIsEnergyOpen(true);
        }
    };

    const handleSelectEnergy = (energy: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedEnergy(energy);
        // Colapsar al terminar
        setIsEnergyOpen(false);
    };

    return (
        <View style={styles.container}>
            {/* -- LUGAR -- */}
            <TouchableOpacity
                style={styles.header}
                activeOpacity={0.7}
                onPress={() => toggleSection(setIsLocationOpen, isLocationOpen)}
            >
                <View style={styles.headerTitleContainer}>
                    <Feather name="map-pin" size={16} color={palette.textSecondary} />
                    <Text style={styles.headerTitle}>¿Dónde entrenas hoy?</Text>
                    {/* Mostrar selección si está contraído */}
                    {!isLocationOpen && selectedLocation && (
                        <Text style={styles.headerSelectedValue}> • {selectedLocation}</Text>
                    )}
                </View>
                <Feather name={isLocationOpen ? "chevron-up" : "chevron-down"} size={16} color={palette.textSecondary} />
            </TouchableOpacity>
            {isLocationOpen && (
                <View style={styles.chipsContainer}>
                    {LOCATIONS.map(loc => {
                        const isSelected = selectedLocation === loc;
                        return (
                            <TouchableOpacity
                                key={loc}
                                style={[styles.chip, isSelected && styles.chipSelected]}
                                onPress={() => handleSelectLocation(loc)}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                    {loc}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {/* -- TIEMPO -- */}
            <TouchableOpacity
                style={[styles.header, { marginTop: isLocationOpen ? 16 : 8 }]}
                activeOpacity={0.7}
                onPress={() => toggleSection(setIsDurationOpen, isDurationOpen)}
            >
                <View style={styles.headerTitleContainer}>
                    <Feather name="clock" size={16} color={palette.textSecondary} />
                    <Text style={styles.headerTitle}>Tiempo disponible</Text>
                    {/* Mostrar selección si está contraído */}
                    {!isDurationOpen && selectedDuration && (
                        <Text style={styles.headerSelectedValue}> • {selectedDuration}</Text>
                    )}
                </View>
                <Feather name={isDurationOpen ? "chevron-up" : "chevron-down"} size={16} color={palette.textSecondary} />
            </TouchableOpacity>
            {isDurationOpen && (
                <View style={styles.chipsContainer}>
                    {DURATIONS.map(dur => {
                        const isSelected = selectedDuration === dur;
                        return (
                            <TouchableOpacity
                                key={dur}
                                style={[styles.chip, isSelected && styles.chipSelected]}
                                onPress={() => handleSelectDuration(dur)}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                    {dur}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {/* -- ENERGÍA -- */}
            <TouchableOpacity
                style={[styles.header, { marginTop: isDurationOpen ? 16 : 8 }]}
                activeOpacity={0.7}
                onPress={() => toggleSection(setIsEnergyOpen, isEnergyOpen)}
            >
                <View style={styles.headerTitleContainer}>
                    <Feather name="battery-charging" size={16} color={palette.textSecondary} />
                    <Text style={styles.headerTitle}>Nivel de energía</Text>
                    {/* Mostrar selección si está contraído */}
                    {!isEnergyOpen && selectedEnergy && (
                        <Text style={styles.headerSelectedValue}> • {selectedEnergy}</Text>
                    )}
                </View>
                <Feather name={isEnergyOpen ? "chevron-up" : "chevron-down"} size={16} color={palette.textSecondary} />
            </TouchableOpacity>
            {isEnergyOpen && (
                <View style={styles.chipsContainer}>
                    {ENERGIES.map(energy => {
                        const isSelected = selectedEnergy === energy;
                        return (
                            <TouchableOpacity
                                key={energy}
                                style={[styles.chip, isSelected && styles.chipSelected]}
                                onPress={() => handleSelectEnergy(energy)}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                    {energy}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: palette.textSecondary,
        fontFamily: fonts.semiBold,
        fontSize: 14,
        letterSpacing: 0.5,
    },
    headerSelectedValue: {
        color: palette.primary,
        fontFamily: fonts.semiBold,
        fontSize: 14,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 8,
    },
    chip: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    chipSelected: {
        backgroundColor: 'rgba(255, 140, 0, 0.15)',
        borderColor: palette.primary,
    },
    chipText: {
        color: palette.textSecondary,
        fontFamily: fonts.regular,
        fontSize: 14,
        textAlign: 'center',
    },
    chipTextSelected: {
        color: palette.primary,
        fontFamily: fonts.semiBold,
    }
});
