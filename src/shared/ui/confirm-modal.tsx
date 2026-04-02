import { fonts, palette } from '@shared/constants/theme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    cancelText: string;
    confirmText: string;
    onCancel: () => void;
    onConfirm: () => void;
    isDestructive?: boolean;
}

export function ConfirmModal({
    visible,
    title,
    message,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
    isDestructive = false,
}: ConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                {/* Blur overlay for Native, solid translucent for Web */}
                {Platform.OS !== 'web' ? (
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                ) : (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.backdrop }]} />
                )}

                {/* Dismiss when tapping outside */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

                <View style={styles.modalContent}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={cancelText}
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={confirmText}
                            style={[styles.button, isDestructive ? styles.destructiveButton : styles.confirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.confirmText, !isDestructive && { color: palette.background }]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: palette.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: palette.border,
        boxShadow: '0 18px 48px rgba(0, 0, 0, 0.32)',
    },
    title: {
        color: palette.textPrimary,
        fontFamily: fonts.bold,
        fontSize: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        color: palette.textSecondary,
        fontFamily: fonts.regular,
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: palette.border,
    },
    cancelText: {
        color: palette.textPrimary,
        fontFamily: fonts.semiBold,
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: palette.primary,
    },
    destructiveButton: {
        backgroundColor: palette.danger,
    },
    confirmText: {
        color: palette.textPrimary, // For destructive, usually white text is better on red background. For primary, it will be overridden inline to palette.background
        fontFamily: fonts.bold,
        fontSize: 16,
    }
});
