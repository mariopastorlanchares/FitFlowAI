import { useEffect, useState } from 'react';

/**
 * Custom hook para generar un efecto de máquina de escribir (Typewriter).
 * 
 * @param text El texto completo que se quiere animar.
 * @param speed La velocidad en milisegundos a la que aparece cada letra.
 * @param enabled Si es false, devuelve el texto completo sin animar.
 * @returns El fragmento de texto animado hasta el momento actual.
 */
export function useTypewriter(text: string, speed: number = 50, enabled: boolean = true) {
    // 1. useState: Guarda el sub-string que se va construyendo
    const [displayedText, setDisplayedText] = useState('');

    // 2. useEffect: Controla el temporizador cuando el componente se pinta o cambian los parámetros
    useEffect(() => {
        // Si el efecto está desactivado, mostramos el texto completo de golpe y salimos
        if (!enabled) {
            setDisplayedText(text);
            return;
        }

        // Reseteamos el texto al empezar
        setDisplayedText('');
        let currentIndex = 0;

        // Configuramos un intervalo que se ejecuta cada 'speed' milisegundos
        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                // Añadimos la siguiente letra al string actual
                setDisplayedText((prevText) => prevText + text.charAt(currentIndex));
                currentIndex++;
            } else {
                // Si ya hemos escrito todo, paramos el temporizador
                clearInterval(intervalId);
            }
        }, speed);

        // Función de "limpieza" (Cleanup): se ejecuta si el componente se destruye
        // o si los parámetros cambian antes de que termine de escribirse.
        return () => {
            clearInterval(intervalId);
        };
    }, [text, speed, enabled]); // Array de dependencias: solo re-ejecuta si cambian estas variables

    return displayedText;
}
