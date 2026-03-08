import { palette, typography } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ExerciseMediaProps {
    name: string;
    imageUrl?: string;
}

export function ExerciseMedia({ name, imageUrl }: ExerciseMediaProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/squats_placeholder.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.exerciseName}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 12,
    },
    exerciseName: {
        ...typography.h2,
        color: palette.primary,
        fontSize: 24,
        letterSpacing: 0.5,
    }
});
