import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

import { fonts, palette } from '@shared/constants/theme';

const LOCATION_KEYS = ['gym', 'home', 'street', 'park'] as const;
const DURATION_KEYS = ['short', 'medium', 'long', 'extended'] as const;
const ENERGY_KEYS = ['low', 'medium', 'high'] as const;

export function WorkoutContextSelector() {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] =
    useState<(typeof LOCATION_KEYS)[number] | null>('gym');
  const [selectedDuration, setSelectedDuration] =
    useState<(typeof DURATION_KEYS)[number] | null>('medium');
  const [selectedEnergy, setSelectedEnergy] =
    useState<(typeof ENERGY_KEYS)[number] | null>('medium');

  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isEnergyOpen, setIsEnergyOpen] = useState(false);

  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean
  ) => {
    setter(!value);
  };

  const handleSelectLocation = (location: (typeof LOCATION_KEYS)[number]) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);

    if (!selectedDuration) {
      setIsDurationOpen(true);
    }
  };

  const handleSelectDuration = (duration: (typeof DURATION_KEYS)[number]) => {
    setSelectedDuration(duration);
    setIsDurationOpen(false);

    if (!selectedEnergy) {
      setIsEnergyOpen(true);
    }
  };

  const handleSelectEnergy = (energy: (typeof ENERGY_KEYS)[number]) => {
    setSelectedEnergy(energy);
    setIsEnergyOpen(false);
  };

  return (
    <Animated.View
      layout={LinearTransition.duration(250).easing(Easing.out(Easing.quad))}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => toggleSection(setIsLocationOpen, isLocationOpen)}
      >
        <View style={styles.headerTitleContainer}>
          <Feather name="map-pin" size={16} color={palette.textSecondary} />
          <Text style={styles.headerTitle}>{t('dashboard.context.locationLabel')}</Text>
          {!isLocationOpen && selectedLocation ? (
            <Text style={styles.headerSelectedValue}>
              {' '}
              • {t(`dashboard.context.locationOptions.${selectedLocation}`)}
            </Text>
          ) : null}
        </View>
        <Feather
          name={isLocationOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={palette.textSecondary}
        />
      </TouchableOpacity>
      {isLocationOpen ? (
        <Animated.View
          entering={FadeInDown.duration(250).easing(Easing.out(Easing.quad))}
          exiting={FadeOutUp.duration(150).easing(Easing.in(Easing.quad))}
          style={styles.chipsContainer}
        >
          {LOCATION_KEYS.map((location) => {
            const isSelected = selectedLocation === location;
            return (
              <TouchableOpacity
                key={location}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleSelectLocation(location)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`dashboard.context.locationOptions.${location}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      ) : null}

      <TouchableOpacity
        style={[styles.header, { marginTop: isLocationOpen ? 16 : 8 }]}
        activeOpacity={0.7}
        onPress={() => toggleSection(setIsDurationOpen, isDurationOpen)}
      >
        <View style={styles.headerTitleContainer}>
          <Feather name="clock" size={16} color={palette.textSecondary} />
          <Text style={styles.headerTitle}>{t('dashboard.context.durationLabel')}</Text>
          {!isDurationOpen && selectedDuration ? (
            <Text style={styles.headerSelectedValue}>
              {' '}
              • {t(`dashboard.context.durationOptions.${selectedDuration}`)}
            </Text>
          ) : null}
        </View>
        <Feather
          name={isDurationOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={palette.textSecondary}
        />
      </TouchableOpacity>
      {isDurationOpen ? (
        <Animated.View
          entering={FadeInDown.duration(250).easing(Easing.out(Easing.quad))}
          exiting={FadeOutUp.duration(150).easing(Easing.in(Easing.quad))}
          style={styles.chipsContainer}
        >
          {DURATION_KEYS.map((duration) => {
            const isSelected = selectedDuration === duration;
            return (
              <TouchableOpacity
                key={duration}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleSelectDuration(duration)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`dashboard.context.durationOptions.${duration}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      ) : null}

      <TouchableOpacity
        style={[styles.header, { marginTop: isDurationOpen ? 16 : 8 }]}
        activeOpacity={0.7}
        onPress={() => toggleSection(setIsEnergyOpen, isEnergyOpen)}
      >
        <View style={styles.headerTitleContainer}>
          <Feather name="battery-charging" size={16} color={palette.textSecondary} />
          <Text style={styles.headerTitle}>{t('dashboard.context.energyLabel')}</Text>
          {!isEnergyOpen && selectedEnergy ? (
            <Text style={styles.headerSelectedValue}>
              {' '}
              • {t(`dashboard.context.energyOptions.${selectedEnergy}`)}
            </Text>
          ) : null}
        </View>
        <Feather
          name={isEnergyOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={palette.textSecondary}
        />
      </TouchableOpacity>
      {isEnergyOpen ? (
        <Animated.View
          entering={FadeInDown.duration(250).easing(Easing.out(Easing.quad))}
          exiting={FadeOutUp.duration(150).easing(Easing.in(Easing.quad))}
          style={styles.chipsContainer}
        >
          {ENERGY_KEYS.map((energy) => {
            const isSelected = selectedEnergy === energy;
            return (
              <TouchableOpacity
                key={energy}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleSelectEnergy(energy)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`dashboard.context.energyOptions.${energy}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      ) : null}
    </Animated.View>
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
    backgroundColor: palette.borderSubtle,
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  chipSelected: {
    backgroundColor: palette.primaryTint,
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
  },
});
