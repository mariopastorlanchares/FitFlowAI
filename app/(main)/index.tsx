import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.container}>
                <Text style={styles.title}>Bienvenido a FitFlowAI</Text>
                <Text style={styles.subtitle}>Estás dentro de la app</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
});
