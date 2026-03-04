import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scroll}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Bienvenido a FitFlow AI</Text>
                <Text style={styles.subtitle}>Estás dentro de la app</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        paddingTop: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0A0A0',
    },
});
