import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance();

const en = {
  translation: {
    common: {
      appName: 'FitFlow AI',
      createAccount: 'Create your account',
      emailPlaceholder: 'Email address',
      passwordPlaceholder: 'Password',
      confirmPasswordPlaceholder: 'Confirm password',
      orConnectWith: 'Or connect with',
      orRegisterWith: 'Or sign up with',
      loading: 'Loading...',
      error: 'Error',
      unexpectedError: 'An unexpected error occurred.',
    },
    login: {
      title: 'FitFlow AI',
      cta: 'Sign In',
      noAccountText: 'New to FitFlow AI?',
      noAccountLink: 'Sign Up',
      errorEmptyFields: 'Please enter your email and password.',
    },
    register: {
      title: 'FitFlow AI',
      cta: 'Sign Up',
      hasAccountText: 'Already have an account?',
      hasAccountLink: 'Sign In',
      errorEmptyFields: 'Please fill in all fields.',
      errorPasswordsDontMatch: 'Passwords do not match.',
      errorPasswordWeak:
        'Password must be at least 8 characters long, contain one number and one uppercase letter.',
      emailVerificationSent:
        'We have sent you a confirmation email. Please check your inbox.',
      successTitle: 'Registration successful!',
    },
    dashboard: {
      tabs: {
        home: 'Home',
        workout: 'Workout',
        stats: 'Stats',
        profile: 'Profile',
      },
      today_workout: "TODAY'S WORKOUT:",
      time: 'min',
      focus: 'Focus',
      start_workout: 'START WORKOUT',
      weekly_streak: 'Weekly Streak:',
      card: {
        title: 'DAY 1 PUSH',
        description: '(Chest, Shoulders, Triceps)',
        duration: '45-50 min',
        focusValue: 'Strength',
      },
      weeklyStreak: {
        label: 'Weekly Streak:',
        progress: '{{completed}}/{{goal}}',
        caption: 'sessions completed',
      },
      context: {
        locationLabel: 'Where are you training today?',
        durationLabel: 'Available time',
        energyLabel: 'Energy level',
        locationOptions: {
          gym: 'Gym',
          home: 'Home',
          street: 'Street',
          park: 'Park',
        },
        durationOptions: {
          short: '30 min',
          medium: '45 min',
          long: '60 min',
          extended: '90 min',
        },
        energyOptions: {
          low: 'Tired',
          medium: 'Normal',
          high: 'High',
        },
      },
    },
    analytics: {
      placeholderTitle: 'Stats are on the way',
      placeholderBody:
        'We will unlock this screen once workout history and recovery metrics come from real data.',
    },
    profile: {
      title: 'My Profile',
      loggedUser: 'Logged in User',
      noEmail: 'No email associated',
      logout: 'Sign Out',
      logoutConfirmTitle: 'Sign Out',
      logoutConfirmMessage: 'Are you sure you want to sign out?',
      logoutCancel: 'Cancel',
      logoutConfirm: 'Yes, sign out',
      logoutError: 'Could not sign out.',
      sections: {
        account: 'Account',
        preferences: 'Preferences',
        support: 'Support',
      },
      options: {
        personalInfo: 'Personal Information',
        theme: 'Theme',
        language: 'Language',
        help: 'Help Center',
        privacy: 'Privacy Policy',
      },
    },
    workout: {
      ai: {
        title: 'AI GUIDE AND SUGGESTION',
        recommendationLabel: 'AI RECOMMENDATION:',
        recommendation: '{{weight}} kg x {{reps}} reps',
        focusAdvice: '(Focus: {{focus}}). {{advice}}',
        defaultFocus: 'Hypertrophy, RIR 2',
        defaultAdvice: 'Go above the previous log if form stays clean.',
      },
      controls: {
        alternative: 'MACHINE BUSY? SEE ALTERNATIVE',
        nextSet: 'LOG SET / NEXT SET',
        finish: 'FINISH WORKOUT',
      },
      rest: {
        title: 'REST TIMER',
        goal: 'Goal {{time}}',
      },
      activeSet: {
        repsUnit: 'reps',
        progress: 'Set {{current}} of {{total}}.',
      },
      screen: {
        aiCommentPlaceholder:
          'Comment for AI (for example, my right shoulder feels unstable)',
      },
      mock: {
        workoutName: 'Chest Day V2',
        exercises: {
          squat: {
            name: 'Back Squat',
            description: 'Olympic bar, keep your back neutral.',
          },
          legPress: {
            name: 'Leg Press',
            description: 'Keep your knees aligned.',
          },
        },
      },
    },
    firebaseErrors: {
      'auth/email-already-in-use': 'Email is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-not-found': 'User not found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid credentials. Please check your data.',
      'auth/weak-password': 'Password is too weak.',
    },
  },
};

const es = {
  translation: {
    common: {
      appName: 'FitFlow AI',
      createAccount: 'Crea tu cuenta',
      emailPlaceholder: 'Correo electrónico',
      passwordPlaceholder: 'Contraseña',
      confirmPasswordPlaceholder: 'Confirmar contraseña',
      orConnectWith: 'O entra con',
      orRegisterWith: 'O regístrate con',
      loading: 'Cargando...',
      error: 'Error',
      unexpectedError: 'Ocurrió un error inesperado.',
    },
    login: {
      title: 'FitFlow AI',
      cta: 'Iniciar sesión',
      noAccountText: 'Nuevo en FitFlow AI?',
      noAccountLink: 'Regístrate',
      errorEmptyFields: 'Por favor, introduce tu email y contraseña.',
    },
    register: {
      title: 'FitFlow AI',
      cta: 'Registrarse',
      hasAccountText: 'Ya tienes cuenta?',
      hasAccountLink: 'Inicia sesión',
      errorEmptyFields: 'Por favor, completa todos los campos.',
      errorPasswordsDontMatch: 'Las contraseñas no coinciden.',
      errorPasswordWeak:
        'La contraseña debe tener al menos 8 caracteres, un número y una mayúscula.',
      emailVerificationSent:
        'Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.',
      successTitle: '¡Registro exitoso!',
    },
    dashboard: {
      tabs: {
        home: 'Inicio',
        workout: 'Entrenar',
        stats: 'Analítica',
        profile: 'Perfil',
      },
      today_workout: 'TU RUTINA DE HOY:',
      time: 'min',
      focus: 'Foco',
      start_workout: 'EMPEZAR ENTRENAMIENTO',
      weekly_streak: 'Racha semanal:',
      card: {
        title: 'DÍA 1 EMPUJE',
        description: '(Pecho, Hombro, Tríceps)',
        duration: '45-50 min',
        focusValue: 'Fuerza',
      },
      weeklyStreak: {
        label: 'Racha semanal:',
        progress: '{{completed}}/{{goal}}',
        caption: 'sesiones completadas',
      },
      context: {
        locationLabel: '¿Dónde entrenas hoy?',
        durationLabel: 'Tiempo disponible',
        energyLabel: 'Nivel de energía',
        locationOptions: {
          gym: 'Gimnasio',
          home: 'Casa',
          street: 'Calle',
          park: 'Parque',
        },
        durationOptions: {
          short: '30 min',
          medium: '45 min',
          long: '60 min',
          extended: '90 min',
        },
        energyOptions: {
          low: 'Agotado',
          medium: 'Normal',
          high: 'A tope',
        },
      },
    },
    analytics: {
      placeholderTitle: 'La analítica llegará pronto',
      placeholderBody:
        'Esta pantalla se activará cuando conectemos el historial de entrenamientos y la recuperación real.',
    },
    profile: {
      title: 'Mi Perfil',
      loggedUser: 'Usuario conectado',
      noEmail: 'Sin correo asociado',
      logout: 'Cerrar sesión',
      logoutConfirmTitle: 'Cerrar sesión',
      logoutConfirmMessage: '¿Estás seguro de que deseas cerrar sesión?',
      logoutCancel: 'Cancelar',
      logoutConfirm: 'Sí, cerrar sesión',
      logoutError: 'No se pudo cerrar sesión.',
      sections: {
        account: 'Cuenta',
        preferences: 'Preferencias',
        support: 'Soporte',
      },
      options: {
        personalInfo: 'Información personal',
        theme: 'Tema',
        language: 'Idioma',
        help: 'Centro de ayuda',
        privacy: 'Política de privacidad',
      },
    },
    workout: {
      ai: {
        title: 'GUIA Y SUGERENCIA DE IA',
        recommendationLabel: 'RECOMENDACION DE IA:',
        recommendation: '{{weight}} kg x {{reps}} reps',
        focusAdvice: '(Foco: {{focus}}). {{advice}}',
        defaultFocus: 'Hipertrofia, RIR 2',
        defaultAdvice: 'Sube respecto al registro anterior si mantienes buena técnica.',
      },
      controls: {
        alternative: 'MAQUINA OCUPADA? VER ALTERNATIVA',
        nextSet: 'LOG SET / SIGUIENTE SET',
        finish: 'FINALIZAR ENTRENAMIENTO',
      },
      rest: {
        title: 'TEMPORIZADOR DE DESCANSO',
        goal: 'Objetivo {{time}}',
      },
      activeSet: {
        repsUnit: 'reps',
        progress: 'Set {{current}} de {{total}}.',
      },
      screen: {
        aiCommentPlaceholder:
          'Comentario para la IA (por ejemplo, me molesta el hombro derecho)',
      },
      mock: {
        workoutName: 'Dia de Pecho V2',
        exercises: {
          squat: {
            name: 'Sentadillas',
            description: 'Barra olímpica, espalda recta.',
          },
          legPress: {
            name: 'Prensa de piernas',
            description: 'Mantener rodillas alineadas.',
          },
        },
      },
    },
    firebaseErrors: {
      'auth/email-already-in-use': 'El correo ya está en uso.',
      'auth/invalid-email': 'El correo no es válido.',
      'auth/user-not-found': 'Usuario no encontrado.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Credenciales inválidas. Por favor, revisa tus datos.',
      'auth/weak-password': 'La contraseña es muy débil.',
    },
  },
};

const systemLang = Localization.getLocales()[0]?.languageCode || 'es';
const supportedLangs = ['en', 'es'];
const initialLang = supportedLangs.includes(systemLang) ? systemLang : 'es';

i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
  },
  lng: initialLang,
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export const getFirebaseErrorMessage = (err: any) => {
  const code = err?.code || err?.error?.message || err?.message;
  if (!code) {
    return i18n.t('common.unexpectedError');
  }

  if (code === 'EMAIL_EXISTS' || code === 'auth/email-already-in-use') {
    return i18n.t('firebaseErrors.auth/email-already-in-use');
  }

  if (code === 'INVALID_EMAIL' || code === 'auth/invalid-email') {
    return i18n.t('firebaseErrors.auth/invalid-email');
  }

  if (code === 'INVALID_PASSWORD' || code === 'auth/wrong-password') {
    return i18n.t('firebaseErrors.auth/wrong-password');
  }

  const specificTranslation = i18n.t(`firebaseErrors.${code}` as any);
  if (specificTranslation !== `firebaseErrors.${code}`) {
    return specificTranslation;
  }

  return err.message || i18n.t('common.unexpectedError');
};
