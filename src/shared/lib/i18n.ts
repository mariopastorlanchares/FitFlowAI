import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance();

const en = {
  translation: {
    common: {
      appName: 'FitFlow AI',
      createAccount: 'Create your account',
      emailLabel: 'Email',
      emailPlaceholder: 'Email address',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Password',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm password',
      orConnectWith: 'Or connect with',
      orRegisterWith: 'Or sign up with',
      apple: 'Apple',
      google: 'Google',
      loading: 'Loading...',
      error: 'Error',
      unexpectedError: 'An unexpected error occurred.',
    },
    login: {
      title: 'FitFlow AI',
      eyebrow: 'Quick access',
      subtitle:
        'Get back to today’s workout, your latest logs and the execution flow without losing context.',
      helper:
        'Use the account linked to your training history so the app can recover your progress and recommendations.',
      cta: 'Sign In',
      noAccountText: 'New to FitFlow AI?',
      noAccountLink: 'Sign Up',
      errorEmptyFields: 'Please enter your email and password.',
    },
    register: {
      title: 'FitFlow AI',
      eyebrow: 'New account',
      subtitle:
        'Create a focused training account before we connect routines, recovery data and AI suggestions.',
      helper:
        'We will send a verification email before enabling the rest of the flow.',
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
      header: {
        eyebrow: 'Today',
        subtitle: 'Choose the session and start training.',
      },
      sessionSetup: {
        title: 'Tune today’s session',
      },
      today_workout: "Your workout today",
      time: 'min',
      focus: 'Focus',
      start_workout: 'Start workout',
      card: {
        title: 'DAY 1 PUSH',
        description: '(Chest, Shoulders, Triceps)',
        duration: '45-50 min',
        focusValue: 'Strength',
        summary: 'Main lifts first, accessories after. Estimated setup: 2 min.',
      },
      weeklyStreak: {
        label: 'Consistency',
        progress: '{{completed}}/{{goal}}',
        caption: 'sessions completed this week',
        title: 'Weekly progress',
        helper: 'One more session keeps the streak on track.',
        daysLabel: '{{days}} days active',
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
        training: 'Training profile',
        account: 'Account',
        preferences: 'Preferences',
        support: 'Support',
      },
      training: {
        eyebrow: 'Firestore',
        loadingTitle: 'Preparing your base profile',
        loadingBody:
          'We are checking whether your training profile exists in Firestore and creating the initial document if needed.',
        readyTitle: 'Base profile ready',
        readyBody:
          'This document is the first persisted contract for training context, preferred locations and future equipment constraints.',
        errorTitle: 'Profile setup needs attention',
        errorBody:
          'We could not load or create your Firestore profile. Retry before editing equipment or training contexts.',
        status: {
          loading: 'Checking',
          ready: 'Ready',
          error: 'Retry needed',
        },
        actions: {
          retry: 'Retry setup',
        },
        fields: {
          experienceLevel: 'Experience level',
          defaultLocation: 'Default location',
          preferredLocations: 'Preferred locations',
          homeEquipment: 'Home equipment',
          contextProfiles: 'Saved contexts',
        },
        experienceLevels: {
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
        },
        values: {
          empty: 'Not defined yet',
          homeEquipmentCount_one: '{{count}} item configured',
          homeEquipmentCount_other: '{{count}} items configured',
          contextProfilesCount_one: '{{count}} context saved',
          contextProfilesCount_other: '{{count}} contexts saved',
        },
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
      header: {
        activeLabel: 'Workout in progress',
        exerciseProgress: 'Exercise {{current}} of {{total}}',
        totalTimer: 'Session',
        exerciseTimer: 'Exercise',
        restTimer: 'Rest',
      },
      exercise: {
        currentLabel: 'Current exercise',
        alternativeAction: 'See alternative',
      },
      ai: {
        title: 'AI support',
        recommendationLabel: 'Suggested target:',
        recommendation: '{{weight}} kg x {{reps}} reps',
        focusAdvice: '(Focus: {{focus}}). {{advice}}',
        defaultFocus: 'Hypertrophy, RIR 2',
        defaultAdvice: 'Go above the previous log if form stays clean.',
        feedbackLabel: 'Anything to adjust?',
        feedbackPlaceholder:
          'Tell the AI if something feels off, unstable or unavailable.',
        feedbackSubmit: 'Send to AI',
      },
      controls: {
        logSet: 'Save set',
        saveChanges: 'Save changes',
        nextExercise: 'Next exercise',
        finish: 'Finish workout',
        helperReady: 'Save the current set when you finish it.',
        helperEditing: 'You are editing a previous set. Saving changes will not trigger rest.',
        helperRest: 'Rest is running, but you can prepare the next set now.',
        helperFinished: 'This exercise is complete. Move on when you are ready.',
      },
      rest: {
        title: 'REST TIMER',
        goal: 'Goal {{time}}',
        skip: 'Skip rest',
      },
      activeSet: {
        title: 'Log this set',
        editTitle: 'Edit set {{current}}',
        targetLabel: 'Target',
        weightLabel: 'Weight',
        repsLabel: 'Reps',
        repsUnit: 'reps',
        progress: 'Set {{current}} of {{total}}.',
        readyHelper: 'Adjust the result before saving it.',
        editingHelper: 'You are correcting a completed set.',
        lockedHelper: 'All sets for this exercise are already completed.',
      },
      setStrip: {
        title: 'Sets',
        currentSetLabel: 'Current set',
        collapse: 'Hide',
        expand: 'Review',
        summary: '{{completed}}/{{total}} completed',
        add: 'Add set',
        removeLast: 'Remove last',
        current: 'Current',
        editing: 'Editing',
        completed: 'Done',
        pending: 'Pending',
      },
      feedback: {
        alternativeTitle: 'Alternative requested',
        alternativeMessage:
          'This is still mocked. The app will suggest another exercise once the AI flow is connected.',
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
      emailLabel: 'Correo',
      emailPlaceholder: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Contraseña',
      confirmPasswordLabel: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Confirmar contraseña',
      orConnectWith: 'O entra con',
      orRegisterWith: 'O regístrate con',
      apple: 'Apple',
      google: 'Google',
      loading: 'Cargando...',
      error: 'Error',
      unexpectedError: 'Ocurrió un error inesperado.',
    },
    login: {
      title: 'FitFlow AI',
      eyebrow: 'Acceso rápido',
      subtitle:
        'Vuelve a tu rutina de hoy, a tus últimos registros y al flujo de ejecución sin perder contexto.',
      helper:
        'Usa la cuenta ligada a tu historial para recuperar progreso y recomendaciones.',
      cta: 'Iniciar sesión',
      noAccountText: 'Nuevo en FitFlow AI?',
      noAccountLink: 'Regístrate',
      errorEmptyFields: 'Por favor, introduce tu email y contraseña.',
    },
    register: {
      title: 'FitFlow AI',
      eyebrow: 'Nueva cuenta',
      subtitle:
        'Crea una cuenta enfocada en entrenamiento antes de conectar rutinas, recuperación y sugerencias de IA.',
      helper:
        'Te enviaremos un correo de verificación antes de habilitar el resto del flujo.',
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
      header: {
        eyebrow: 'Hoy',
        subtitle: 'Elige la sesión y empieza a entrenar.',
      },
      sessionSetup: {
        title: 'Ajusta la sesión de hoy',
      },
      today_workout: 'Tu entrenamiento de hoy',
      time: 'min',
      focus: 'Foco',
      start_workout: 'Empezar entrenamiento',
      card: {
        title: 'DÍA 1 EMPUJE',
        description: '(Pecho, Hombro, Tríceps)',
        duration: '45-50 min',
        focusValue: 'Fuerza',
        summary: 'Primero básicos, después accesorios. Preparación estimada: 2 min.',
      },
      weeklyStreak: {
        label: 'Consistencia',
        progress: '{{completed}}/{{goal}}',
        caption: 'sesiones completadas esta semana',
        title: 'Progreso semanal',
        helper: 'Una sesión más mantiene la racha en rumbo.',
        daysLabel: '{{days}} días activo',
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
        training: 'Perfil de entrenamiento',
        account: 'Cuenta',
        preferences: 'Preferencias',
        support: 'Soporte',
      },
      training: {
        eyebrow: 'Firestore',
        loadingTitle: 'Preparando tu perfil base',
        loadingBody:
          'Estamos comprobando si tu perfil de entrenamiento existe en Firestore y creando el documento inicial si hace falta.',
        readyTitle: 'Perfil base listo',
        readyBody:
          'Este documento es el primer contrato persistido para el contexto de entrenamiento, ubicaciones preferidas y futuras restricciones de equipamiento.',
        errorTitle: 'La configuración del perfil requiere atención',
        errorBody:
          'No hemos podido cargar o crear tu perfil en Firestore. Reinténtalo antes de editar equipamiento o contextos de entrenamiento.',
        status: {
          loading: 'Comprobando',
          ready: 'Listo',
          error: 'Reintento necesario',
        },
        actions: {
          retry: 'Reintentar configuración',
        },
        fields: {
          experienceLevel: 'Nivel de experiencia',
          defaultLocation: 'Ubicación por defecto',
          preferredLocations: 'Ubicaciones preferidas',
          homeEquipment: 'Equipamiento en casa',
          contextProfiles: 'Contextos guardados',
        },
        experienceLevels: {
          beginner: 'Principiante',
          intermediate: 'Intermedio',
          advanced: 'Avanzado',
        },
        values: {
          empty: 'Aún sin definir',
          homeEquipmentCount_one: '{{count}} elemento configurado',
          homeEquipmentCount_other: '{{count}} elementos configurados',
          contextProfilesCount_one: '{{count}} contexto guardado',
          contextProfilesCount_other: '{{count}} contextos guardados',
        },
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
      header: {
        activeLabel: 'Entrenamiento en curso',
        exerciseProgress: 'Ejercicio {{current}} de {{total}}',
        totalTimer: 'Sesión',
        exerciseTimer: 'Ejercicio',
        restTimer: 'Descanso',
      },
      exercise: {
        currentLabel: 'Ejercicio actual',
        alternativeAction: 'Ver alternativa',
      },
      ai: {
        title: 'Soporte IA',
        recommendationLabel: 'Objetivo sugerido:',
        recommendation: '{{weight}} kg x {{reps}} reps',
        focusAdvice: '(Foco: {{focus}}). {{advice}}',
        defaultFocus: 'Hipertrofia, RIR 2',
        defaultAdvice: 'Sube respecto al registro anterior si mantienes buena técnica.',
        feedbackLabel: '¿Algo que ajustar?',
        feedbackPlaceholder:
          'Cuéntale a la IA si algo molesta, está inestable o no está disponible.',
        feedbackSubmit: 'Enviar a IA',
      },
      controls: {
        logSet: 'Guardar set',
        saveChanges: 'Guardar cambios',
        nextExercise: 'Siguiente ejercicio',
        finish: 'Finalizar entrenamiento',
        helperReady: 'Guarda el set actual cuando lo termines.',
        helperEditing:
          'Estás editando un set anterior. Guardar cambios no activará el descanso.',
        helperRest: 'El descanso sigue corriendo, pero ya puedes preparar el siguiente set.',
        helperFinished: 'Este ejercicio ya está completo. Avanza cuando quieras.',
      },
      rest: {
        title: 'TEMPORIZADOR DE DESCANSO',
        goal: 'Objetivo {{time}}',
        skip: 'Saltar descanso',
      },
      activeSet: {
        title: 'Registrar este set',
        editTitle: 'Editar set {{current}}',
        targetLabel: 'Objetivo',
        weightLabel: 'Peso',
        repsLabel: 'Repeticiones',
        repsUnit: 'reps',
        progress: 'Set {{current}} de {{total}}.',
        readyHelper: 'Ajusta el resultado antes de guardarlo.',
        editingHelper: 'Estás corrigiendo un set ya completado.',
        lockedHelper: 'Todos los sets de este ejercicio ya están completados.',
      },
      setStrip: {
        title: 'Sets',
        currentSetLabel: 'Set actual',
        collapse: 'Ocultar',
        expand: 'Revisar',
        summary: '{{completed}}/{{total}} completados',
        add: 'Añadir set',
        removeLast: 'Eliminar último',
        current: 'Actual',
        editing: 'Editando',
        completed: 'Hecho',
        pending: 'Pendiente',
      },
      feedback: {
        alternativeTitle: 'Alternativa solicitada',
        alternativeMessage:
          'Esto sigue mockeado. La app propondrá otro ejercicio cuando conectemos el flujo de IA.',
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
