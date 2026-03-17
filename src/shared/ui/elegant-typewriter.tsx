import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface ElegantTypewriterProps {
    text: string;
    style?: any;
    typingSpeed?: number;
    fadeDuration?: number;
}

/**
 * Componente que renderiza un texto carácter por carácter,
 * aplicando un suave `fade in` a cada letra para evitar los molestos
 * saltos de layout (wobble) al estar centrado.
 * Estilo similar a los chats de IA avanzados como Gemini o ChatGPT.
 */
export function ElegantTypewriter({
    text,
    style,
    typingSpeed = 40,
    fadeDuration = 300
}: ElegantTypewriterProps) {
    // Pre-creamos una variable animada de opacidad (0) puramente nativa por cada carácter.
    const opacities = useRef(text.split('').map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // En caso de que el texto cambie en caliente (para MVP no suele pasar, pero es buena práctica)
        opacities.forEach(v => v.setValue(0));

        // Creamos un array de animaciones (fade in a opacidad 1)
        const animations = text.split('').map((_, index) => {
            return Animated.timing(opacities[index], {
                toValue: 1,
                duration: fadeDuration,
                useNativeDriver: true, // Esto mueve la animación a la GPU, clave para 60fps fluidos
            });
        });

        // Ejecutamos las animaciones de forma escalonada. 
        // Cada 'typingSpeed' milisegundos arranca la siguiente letra.
        Animated.stagger(typingSpeed, animations).start();

        return () => {
            // Cleanup: detenemos todas las animaciones nativas si el componente muere
            animations.forEach(anim => anim.stop());
        };
    }, [text, fadeDuration, typingSpeed, opacities]); // opacities.current no muta el array en longitud

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {text.split('').map((char, index) => (
                <Animated.Text
                    key={`${index}-${char}`}
                    style={[
                        style,
                        { opacity: opacities[index] }
                    ]}
                >
                    {/* Espacio invisible manual si el string tiene espacios, ya que React Native suele colapsarlos */}
                    {char === ' ' ? '\u00A0' : char}
                </Animated.Text>
            ))}
        </View>
    );
}
