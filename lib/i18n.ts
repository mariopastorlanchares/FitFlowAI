import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- EN ---
const en = {
    translation: {
        common: {
            appName: "FitFlow AI",
            createAccount: "Create your account",
            emailPlaceholder: "Email address",
            passwordPlaceholder: "Password",
            confirmPasswordPlaceholder: "Confirm password",
            orConnectWith: "Or connect with",
            orRegisterWith: "Or sign up with",
            loading: "Loading...",
            error: "Error",
            unexpectedError: "An unexpected error occurred."
        },
        login: {
            title: "FitFlow AI",
            cta: "Sign In",
            noAccountText: "New to FitFlow AI?",
            noAccountLink: "Sign Up",
            errorEmptyFields: "Please enter your email and password."
        },
        dashboard: {
            tabs: {
                home: "Home",
                workout: "Workout",
                stats: "Stats",
                profile: "Profile"
            },
            today_workout: "TODAY'S WORKOUT:",
            time: "min",
            focus: "Focus",
            start_workout: "START WORKOUT",
            weekly_streak: "Weekly Streak:"
        },
        register: {
            title: "FitFlow AI",
            cta: "Sign Up",
            hasAccountText: "Already have an account?",
            hasAccountLink: "Sign In",
            errorEmptyFields: "Please fill in all fields.",
            errorPasswordsDontMatch: "Passwords do not match.",
            errorPasswordWeak: "Password must be at least 8 characters long, contain one number and one uppercase letter.",
            emailVerificationSent: "We have sent you a confirmation email. Please check your inbox.",
            successTitle: "Registration successful!"
        },
        profile: {
            title: "My Profile",
            loggedUser: "Logged in User",
            noEmail: "No email associated",
            logout: "Sign Out",
            logoutError: "Could not sign out."
        },
        firebaseErrors: {
            "auth/email-already-in-use": "Email is already in use.",
            "auth/invalid-email": "Invalid email address.",
            "auth/user-not-found": "User not found.",
            "auth/wrong-password": "Incorrect password.",
            "auth/invalid-credential": "Invalid credentials. Please check your data.",
            "auth/weak-password": "Password is too weak."
        }
    }
};

// --- ES ---
const es = {
    translation: {
        common: {
            appName: "FitFlow AI",
            createAccount: "Crea tu cuenta",
            emailPlaceholder: "Correo electrónico",
            passwordPlaceholder: "Contraseña",
            confirmPasswordPlaceholder: "Confirmar contraseña",
            orConnectWith: "O entra con",
            orRegisterWith: "O regístrate con",
            loading: "Cargando...",
            error: "Error",
            unexpectedError: "Ocurrió un error inesperado."
        },
        login: {
            title: "FitFlow AI",
            cta: "Iniciar Sesión",
            noAccountText: "¿Nuevo en FitFlow AI?",
            noAccountLink: "Regístrate",
            errorEmptyFields: "Por favor, introduce tu email y contraseña."
        },
        dashboard: {
            tabs: {
                home: "Inicio",
                workout: "Entrenar",
                stats: "Analítica",
                profile: "Perfil"
            },
            today_workout: "TU RUTINA DE HOY:",
            time: "min",
            focus: "Foco",
            start_workout: "EMPEZAR ENTRENAMIENTO",
            weekly_streak: "Racha Semanal:"
        },
        register: {
            title: "FitFlow AI",
            cta: "Registrarse",
            hasAccountText: "¿Ya tienes cuenta?",
            hasAccountLink: "Inicia Sesión",
            errorEmptyFields: "Por favor, completa todos los campos.",
            errorPasswordsDontMatch: "Las contraseñas no coinciden.",
            errorPasswordWeak: "La contraseña debe tener al menos 8 caracteres, un número y una mayúscula.",
            emailVerificationSent: "Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.",
            successTitle: "¡Registro exitoso!"
        },
        profile: {
            title: "Mi Perfil",
            loggedUser: "Usuario Conectado",
            noEmail: "Sin correo asociado",
            logout: "Cerrar Sesión",
            logoutError: "No se pudo cerrar sesión."
        },
        firebaseErrors: {
            "auth/email-already-in-use": "El correo ya está en uso.",
            "auth/invalid-email": "El correo no es válido.",
            "auth/user-not-found": "Usuario no encontrado.",
            "auth/wrong-password": "Contraseña incorrecta.",
            "auth/invalid-credential": "Credenciales inválidas. Por favor, revisa tus datos.",
            "auth/weak-password": "La contraseña es muy débil."
        }
    }
};

// --- Initialization ---

// Get system language, fallback to 'es'. E.g: "en-US" -> "en"
const systemLang = Localization.getLocales()[0]?.languageCode || 'es';
const supportedLangs = ['en', 'es'];
const initialLang = supportedLangs.includes(systemLang) ? systemLang : 'es';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            es,
        },
        lng: initialLang,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
    });

export default i18n;

export const getFirebaseErrorMessage = (err: any) => {
    // If we have a structured code inside the Firebase structure
    const code = err?.code || err?.error?.message || err?.message;
    if (!code) return i18n.t('common.unexpectedError');

    // Mapped errors inside firebaseErrors:
    // Some errors like "EMAIL_EXISTS" from User's prompt should be mapped 
    if (code === 'EMAIL_EXISTS' || code === 'auth/email-already-in-use') {
        return i18n.t('firebaseErrors.auth/email-already-in-use');
    }
    if (code === 'INVALID_EMAIL' || code === 'auth/invalid-email') {
        return i18n.t('firebaseErrors.auth/invalid-email');
    }
    if (code === 'INVALID_PASSWORD' || code === 'auth/wrong-password') {
        return i18n.t('firebaseErrors.auth/wrong-password');
    }

    // Check if the exact error code is in the translations
    const specificTranslation = i18n.t(`firebaseErrors.${code}` as any);
    if (specificTranslation !== `firebaseErrors.${code}`) {
        return specificTranslation;
    }

    return err.message || i18n.t('common.unexpectedError');
};
