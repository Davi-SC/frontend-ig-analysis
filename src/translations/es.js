import { APP_CONSTANTS } from './constants';

export const es = {
  // Language selector
  language: {
    name: 'Español',
    code: 'es'
  },

  // Home page
  home: {
    underConstruction: 'EN DESARROLLO',
    title: 'App en Construcción',
    description: 'Estamos desarrollando una plataforma completa para análisis de datos de Instagram y métricas de audiencia a través de la API de Meta.',
    featuresTitle: 'Funcionalidades Planificadas',
    features: [
      'Recopilación automática de datos de publicaciones de Instagram',
      'Análisis detallado de métricas de audiencia',
      'Informes personalizados de rendimiento',
      'Insights sobre engagement y alcance'
    ],
    privacyLink: '🔒 Política de Privacidad',
    termsLink: '📋 Términos de Uso',
    footer: '¡Pronto podrás transformar tus datos de Instagram en insights valiosos!'
  },

  // Privacy page
  privacy: {
    backToHome: '← Volver al Inicio',
    title: '🔒 Política de Privacidad',
    lastUpdated: `Última actualización: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos los datos de los usuarios en nuestra aplicación de análisis de Instagram.',
    
    section1: {
      title: '1. Información que Recopilamos',
      description: 'Nuestra aplicación recopila solo los datos que usted autoriza explícitamente a través del proceso de autenticación OAuth de Meta/Instagram. Estos datos incluyen:',
      items: [
        '<strong>Información de Perfil:</strong> Nombre de usuario, nombre de visualización, foto de perfil y biografía',
        '<strong>Datos de Medios:</strong> Publicaciones, incluyendo fotos, videos, subtítulos, URLs y timestamps',
        '<strong>Métricas de Engagement:</strong> Número de me gusta, comentarios, vistas y otras métricas públicas proporcionadas por la API de Instagram',
        '<strong>Información de Audiencia:</strong> Datos demográficos y estadísticas de alcance, cuando estén disponibles y autorizados'
      ],
      note: '<strong>Importante:</strong> Recopilamos SOLO los datos que usted autoriza explícitamente a través de los permisos de la API de Meta. No tenemos acceso a mensajes privados, información de inicio de sesión o cualquier dato no autorizado.'
    },

    section2: {
      title: '2. Cómo Usamos los Datos',
      description: 'Los datos recopilados se utilizan exclusivamente para:',
      items: [
        'Generar análisis e informes sobre el rendimiento de publicaciones y perfiles de Instagram',
        'Calcular métricas de engagement y alcance de la audiencia',
        'Crear dashboards y visualizaciones personalizadas de datos',
        'Proporcionar insights sobre tendencias y patrones de contenido',
        'Mejorar la calidad y precisión de los análisis proporcionados'
      ]
    },

    section3: {
      title: '3. Almacenamiento y Seguridad',
      description: 'Implementamos medidas de seguridad técnicas y organizacionales para proteger sus datos:',
      items: [
        'Encriptación de datos en tránsito y en reposo',
        'Acceso restringido a los datos solo para procesamiento autorizado',
        'Monitoreo regular de seguridad y actualizaciones del sistema',
        'Cumplimiento con las directrices de seguridad de Meta Platform'
      ]
    },

    section4: {
      title: '4. Compartir Datos',
      noShare: '<strong>No compartimos, vendemos ni alquilamos sus datos personales a terceros.</strong>',
      description: 'Sus datos se utilizan exclusivamente dentro de nuestra plataforma para proporcionar los servicios de análisis solicitados. Podemos compartir datos solo en las siguientes circunstancias:',
      items: [
        'Con su consentimiento expreso',
        'Cuando sea requerido por ley u orden judicial',
        'Para proteger nuestros derechos legales o la seguridad de los usuarios'
      ]
    },

    section5: {
      title: '5. Sus Derechos',
      description: 'Usted tiene los siguientes derechos sobre sus datos:',
      items: [
        '<strong>Acceso:</strong> Solicitar una copia de los datos que tenemos sobre usted',
        '<strong>Corrección:</strong> Solicitar la corrección de datos inexactos',
        '<strong>Eliminación:</strong> Solicitar la eliminación completa de sus datos',
        '<strong>Revocación:</strong> Revocar permisos de acceso en cualquier momento a través de la configuración de Instagram',
        '<strong>Portabilidad:</strong> Solicitar sus datos en formato legible por máquina'
      ],
      contact: `Para ejercer cualquiera de estos derechos, contáctenos a través del correo electrónico: <strong>${APP_CONSTANTS.emails.privacy}</strong>`
    },

    section6: {
      title: '6. Retención de Datos',
      description: 'Mantenemos sus datos solo durante el tiempo necesario para proporcionar los servicios solicitados o según lo exija la ley. Puede solicitar la eliminación de sus datos en cualquier momento, y serán eliminados de nuestros sistemas en un plazo de 30 días.'
    },

    section7: {
      title: '7. Cookies y Tecnologías Similares',
      description: 'Utilizamos cookies y tecnologías similares solo para funcionalidades esenciales de la aplicación, como mantener su sesión activa y preferencias de usuario. No utilizamos cookies de terceros para rastreo o publicidad.'
    },

    section8: {
      title: '8. Cumplimiento con Meta Platform',
      description: 'Esta aplicación cumple con los <a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">Términos de la Plataforma Meta</a> y la <a href="https://developers.facebook.com/policy" target="_blank" rel="noopener noreferrer">Política de Datos de Meta</a>. Respetamos todas las limitaciones y requisitos impuestos por la API de Instagram.'
    },

    section9: {
      title: '9. Cambios en esta Política',
      description: 'Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos a través de la aplicación o por correo electrónico. La versión más reciente estará siempre disponible en esta página con la fecha de actualización.'
    },

    section10: {
      title: '10. Contacto',
      description: 'Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de sus datos, contáctenos:',
      email: `<strong>Correo Electrónico:</strong> ${APP_CONSTANTS.emails.privacy}`,
      support: `<strong>Soporte:</strong> ${APP_CONSTANTS.emails.support}`
    },

    homeLink: '🏠 Inicio',
    termsLink: '📋 Términos de Uso',
    dataDeletionLink: '🗑️ Eliminación de Datos'
  },

  // Data Deletion page
  dataDeletion: {
    backToHome: '← Volver al Inicio',
    title: '🗑️ Solicitud de Eliminación de Datos',
    lastUpdated: `Última actualización: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Usted tiene el derecho de solicitar la eliminación completa de sus datos de nuestra plataforma. Esta página explica cómo hacer esta solicitud y qué esperar.',

    section1: {
      title: '1. Su Derecho a la Eliminación de Datos',
      description: 'De acuerdo con las regulaciones de protección de datos y políticas de Meta Platform, puede solicitar la eliminación de todos los datos que hemos recopilado sobre su cuenta de Instagram. Esto incluye:',
      items: [
        'Información de perfil (nombre de usuario, nombre de visualización, biografía)',
        'Datos de medios (publicaciones, fotos, videos, subtítulos)',
        'Métricas de engagement (me gusta, comentarios, vistas)',
        'Todos los informes de análisis e insights generados',
        'Registros de acceso e historial de uso'
      ]
    },

    section2: {
      title: '2. Cómo Solicitar la Eliminación de Datos',
      description: 'Para solicitar la eliminación de sus datos, siga estos pasos:',
      steps: [
        `Envíe un correo electrónico a <strong>${APP_CONSTANTS.emails.privacy}</strong>`,
        'En la línea de asunto, escriba: "Solicitud de Eliminación de Datos"',
        'En el cuerpo del correo, incluya:',
        '• Su nombre de usuario de Instagram',
        '• La dirección de correo electrónico asociada con su cuenta (si aplica)',
        '• Confirmación de que desea que todos sus datos sean eliminados',
        'Confirmaremos la recepción de su solicitud en un plazo de 48 horas'
      ]
    },

    section3: {
      title: '3. Plazo de Procesamiento',
      description: 'Su solicitud de eliminación de datos se procesará según el siguiente cronograma:',
      items: [
        '<strong>Confirmación:</strong> En un plazo de 48 horas después de recibir su solicitud',
        '<strong>Procesamiento:</strong> Hasta 30 días para la eliminación completa de datos',
        '<strong>Notificación de Finalización:</strong> Confirmación por correo electrónico cuando la eliminación esté completa',
        '<strong>Sistemas de Respaldo:</strong> Los datos en sistemas de respaldo se eliminarán en el próximo ciclo programado (hasta 90 días)'
      ]
    },

    section4: {
      title: '4. Qué Sucede Después de la Eliminación',
      warning: '<strong>Importante:</strong> La eliminación de datos es irreversible. Una vez que sus datos sean eliminados:',
      items: [
        'Perderá el acceso a todos los informes de análisis e insights',
        'Los datos históricos y métricas ya no estarán disponibles',
        'Deberá reautorizar la aplicación para usar los servicios nuevamente',
        'Los análisis anteriores no pueden recuperarse',
        'El proceso de eliminación no se puede deshacer'
      ]
    },

    section5: {
      title: '5. Revocando Permisos de Instagram',
      description: 'Además de solicitar la eliminación de datos de nuestra plataforma, también puede revocar el acceso de nuestra aplicación a su cuenta de Instagram:',
      steps: [
        'Vaya a la Configuración de Instagram',
        'Navegue a "Seguridad" → "Apps y Sitios Web"',
        'Encuentre nuestra aplicación en la lista',
        'Haga clic en "Eliminar" para revocar todos los permisos',
        'Nota: Esto no elimina los datos que ya hemos recopilado; debe enviar una solicitud de eliminación para eso'
      ]
    },

    section6: {
      title: '6. Excepciones y Requisitos Legales',
      description: 'Podemos retener cierta información si lo exige la ley o para propósitos comerciales legítimos:',
      items: [
        'Datos necesarios para cumplir con obligaciones legales',
        'Información necesaria para resolver disputas o hacer cumplir acuerdos',
        'Datos anonimizados utilizados para análisis estadístico (no pueden identificarlo)',
        'Registros de auditoría necesarios para fines de seguridad'
      ],
      note: 'Cualquier dato retenido se limitará a lo que sea legalmente requerido y se mantendrá seguro.'
    },

    section7: {
      title: '7. Preguntas o Problemas',
      description: `Si tiene preguntas sobre el proceso de eliminación de datos o encuentra algún problema, contáctenos en <strong>${APP_CONSTANTS.emails.support}</strong>`,
      response: 'Responderemos a su consulta en un plazo de 2 días hábiles.'
    },

    section8: {
      title: '8. Cumplimiento con Meta Platform',
      description: `Este proceso de eliminación de datos cumple con los <a href="https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback" target="_blank" rel="noopener noreferrer">Requisitos de Eliminación de Datos de Meta Platform</a>. Para más información sobre sus derechos, consulte nuestra <a href="/privacy">Política de Privacidad</a>.`
    },

    homeLink: '🏠 Inicio',
    privacyLink: '🔒 Política de Privacidad',
    termsLink: '📋 Términos de Uso'
  },

  // Terms page
  terms: {
    backToHome: '← Volver al Inicio',
    title: '📋 Términos de Uso',
    lastUpdated: `Última actualización: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Bienvenido a nuestra aplicación de análisis de Instagram. Al utilizar este servicio, usted acepta los términos y condiciones descritos a continuación.',

    section1: {
      title: '1. Aceptación de los Términos',
      description: 'Al acceder y utilizar esta aplicación, usted acepta y se compromete a cumplir con estos Términos de Uso y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido utilizar o acceder a este servicio.',
      warning: '<strong>Atención:</strong> El uso de esta aplicación implica la aceptación automática de estos términos. Por favor, léalos cuidadosamente.'
    },

    section2: {
      title: '2. Descripción del Servicio',
      description: 'Esta aplicación proporciona herramientas de análisis para datos públicos de Instagram, recopilados a través de la API oficial de Meta Platform. Los servicios incluyen:',
      items: [
        'Recopilación automatizada de datos de publicaciones y perfiles de Instagram',
        'Análisis de métricas de engagement y alcance',
        'Generación de informes y dashboards personalizados',
        'Insights sobre rendimiento de contenido y audiencia'
      ]
    },

    section3: {
      title: '3. Requisitos de Uso',
      description: 'Para utilizar este servicio, usted debe:',
      items: [
        'Tener al menos 18 años de edad o la mayoría de edad en su jurisdicción',
        'Poseer una cuenta activa de Instagram',
        'Tener autorización para acceder a los datos que serán analizados',
        'Estar de acuerdo con los Términos de Servicio de Instagram y Meta Platform',
        'No utilizar el servicio para fines ilegales o no autorizados'
      ]
    },

    section4: {
      title: '4. Autenticación y Permisos',
      description: 'Usted autoriza a esta aplicación a acceder a sus datos de Instagram a través del proceso de autenticación OAuth de Meta. Usted puede:',
      items: [
        'Revocar los permisos en cualquier momento a través de la configuración de Instagram',
        'Controlar qué datos se comparten durante el proceso de autorización',
        'Solicitar la eliminación de todos los datos recopilados'
      ],
      note: '<strong>Importante:</strong> La revocación de permisos puede resultar en la interrupción de los servicios de análisis.'
    },

    section5: {
      title: '5. Uso Aceptable',
      description: 'Usted acepta NO:',
      items: [
        'Utilizar el servicio para violar cualquier ley o regulación aplicable',
        'Intentar acceder a datos de cuentas que no posee o no está autorizado',
        'Realizar ingeniería inversa, descompilar o desensamblar la aplicación',
        'Utilizar el servicio para spam, fraude u otras actividades maliciosas',
        'Sobrecargar o interferir con la infraestructura de la aplicación',
        'Violar los Términos de Servicio de Instagram o Meta Platform',
        'Recopilar datos de manera que viole la privacidad de otros usuarios',
        'Revender o redistribuir datos o servicios sin autorización'
      ]
    },

    section6: {
      title: '6. Limitaciones del Servicio',
      description: 'La aplicación está sujeta a las limitaciones impuestas por la API de Instagram:',
      items: [
        'Límites de tasa de solicitudes (rate limits)',
        'Disponibilidad de datos según las políticas de Meta',
        'Cambios en las funcionalidades de la API',
        'Posibles interrupciones por mantenimiento o actualizaciones'
      ],
      note: 'No garantizamos disponibilidad ininterrumpida del servicio y nos reservamos el derecho de modificar, suspender o descontinuar funcionalidades en cualquier momento.'
    },

    section7: {
      title: '7. Propiedad Intelectual',
      yourData: '<strong>Sus Datos:</strong> Usted mantiene todos los derechos sobre los datos de su Instagram. No reclamamos propiedad sobre su contenido.',
      ourService: '<strong>Nuestro Servicio:</strong> La aplicación, incluyendo su código, diseño, marca y funcionalidades, es de nuestra propiedad exclusiva y está protegida por leyes de propiedad intelectual.'
    },

    section8: {
      title: '8. Limitación de Responsabilidad',
      description: 'Este servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". No garantizamos:',
      items: [
        'Precisión o completitud de los datos recopilados',
        'Disponibilidad continua del servicio',
        'Idoneidad para cualquier propósito específico',
        'Ausencia de errores o interrupciones'
      ],
      warning: '<strong>Importante:</strong> Bajo ninguna circunstancia seremos responsables de daños directos, indirectos, incidentales, consecuentes o punitivos resultantes del uso o la incapacidad de usar este servicio.'
    },

    section9: {
      title: '9. Cumplimiento con Meta Platform',
      description: 'Esta aplicación opera en cumplimiento con:',
      items: [
        '<a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">Términos de la Plataforma Meta</a>',
        '<a href="https://developers.facebook.com/policy" target="_blank" rel="noopener noreferrer">Política de la Plataforma Meta</a>',
        '<a href="https://help.instagram.com/581066165581870" target="_blank" rel="noopener noreferrer">Términos de Uso de Instagram</a>',
        'Instagram Graph API - Términos y Limitaciones'
      ],
      note: 'Cualquier violación de estos términos puede resultar en la suspensión o terminación del acceso a la aplicación.'
    },

    section10: {
      title: '10. Privacidad y Protección de Datos',
      description: 'El uso de sus datos se rige por nuestra <a href="/privacy">Política de Privacidad</a>. Al usar este servicio, también acepta los términos de nuestra política de privacidad.'
    },

    section11: {
      title: '11. Suspensión y Terminación',
      description: 'Nos reservamos el derecho de suspender o terminar su acceso al servicio, en cualquier momento y sin previo aviso, si:',
      items: [
        'Usted viola estos Términos de Uso',
        'Usted viola los términos de Meta Platform o Instagram',
        'Su uso representa un riesgo de seguridad o legal',
        'Usted realiza actividades fraudulentas o abusivas'
      ]
    },

    section12: {
      title: '12. Modificaciones en los Términos',
      description: 'Podemos actualizar estos Términos de Uso periódicamente para reflejar cambios en nuestros servicios o requisitos legales. Los cambios significativos se comunicarán a través de:',
      items: [
        'Notificación dentro de la aplicación',
        'Correo electrónico a la dirección registrada',
        'Actualización de la fecha en esta página'
      ],
      note: 'El uso continuado del servicio después de los cambios constituye la aceptación de los nuevos términos.'
    },

    section13: {
      title: '13. Ley Aplicable',
      description: 'Estos términos se rigen e interpretan de acuerdo con las leyes de España. Cualquier disputa relacionada con estos términos se resolverá en los tribunales competentes de España.'
    },

    section14: {
      title: '14. Contacto',
      description: 'Para preguntas, soporte o cuestiones relacionadas con estos Términos de Uso:',
      support: `<strong>Correo Electrónico de Soporte:</strong> ${APP_CONSTANTS.emails.support}`,
      legal: `<strong>Correo Electrónico Legal:</strong> ${APP_CONSTANTS.emails.legal}`
    },

    versionInfo: {
      lastUpdate: `<strong>Última Actualización:</strong> ${APP_CONSTANTS.lastUpdated}`,
      version: `<strong>Versión:</strong> ${APP_CONSTANTS.version}`,
      effectiveDate: `<strong>Fecha de Vigencia:</strong> ${APP_CONSTANTS.effectiveDate}`
    },

    homeLink: '🏠 Inicio',
    privacyLink: '🔒 Política de Privacidad'
  }
};
