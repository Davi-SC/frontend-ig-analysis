import { APP_CONSTANTS } from './constants';

export const pt = {
  // Language selector
  language: {
    name: 'Português',
    code: 'pt'
  },

  // Home page
  home: {
    underConstruction: 'EM DESENVOLVIMENTO',
    title: 'App em Construção',
    description: 'Estamos desenvolvendo uma plataforma completa para análise de dados do Instagram e métricas de audiência através da API da Meta.',
    featuresTitle: 'Funcionalidades Planejadas',
    features: [
      'Coleta automática de dados de posts do Instagram',
      'Análise detalhada de métricas de audiência',
      'Relatórios personalizados de desempenho',
      'Insights sobre engajamento e alcance'
    ],
    dashboardLink: '📊 Dashboard',
    privacyLink: '🔒 Política de Privacidade',
    termsLink: '📋 Termos de Uso',
    footer: 'Em breve, você poderá transformar seus dados do Instagram em insights valiosos!'
  },

  // Privacy page
  privacy: {
    backToHome: '← Voltar para Home',
    title: '🔒 Política de Privacidade',
    lastUpdated: `Última atualização: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos os dados dos usuários em nosso aplicativo de análise de Instagram.',
    
    section1: {
      title: '1. Informações que Coletamos',
      description: 'Nosso aplicativo coleta apenas dados que você autoriza explicitamente através do processo de autenticação OAuth da Meta/Instagram. Estes dados incluem:',
      items: [
        '<strong>Informações de Perfil:</strong> Nome de usuário, nome de exibição, foto de perfil e biografia',
        '<strong>Dados de Mídia:</strong> Posts publicados, incluindo fotos, vídeos, legendas, URLs e timestamps',
        '<strong>Métricas de Engajamento:</strong> Número de curtidas, comentários, visualizações e outras métricas públicas disponibilizadas pela API do Instagram',
        '<strong>Informações da Audiência:</strong> Dados demográficos e estatísticas de alcance, quando disponíveis e autorizados'
      ],
      note: '<strong>Importante:</strong> Coletamos APENAS os dados que você autoriza explicitamente através das permissões da API da Meta. Não temos acesso a mensagens privadas, informações de login ou qualquer dado não autorizado.'
    },

    section2: {
      title: '2. Como Usamos os Dados',
      description: 'Os dados coletados são utilizados exclusivamente para:',
      items: [
        'Gerar análises e relatórios sobre o desempenho de posts e perfis do Instagram',
        'Calcular métricas de engajamento e alcance da audiência',
        'Criar dashboards e visualizações personalizadas de dados',
        'Fornecer insights sobre tendências e padrões de conteúdo',
        'Melhorar a qualidade e precisão das análises fornecidas'
      ]
    },

    section3: {
      title: '3. Armazenamento e Segurança',
      description: 'Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:',
      items: [
        'Criptografia de dados em trânsito e em repouso',
        'Acesso restrito aos dados apenas para processamento autorizado',
        'Monitoramento regular de segurança e atualizações do sistema',
        'Conformidade com as diretrizes de segurança da Meta Platform'
      ]
    },

    section4: {
      title: '4. Compartilhamento de Dados',
      noShare: '<strong>Não compartilhamos, vendemos ou alugamos seus dados pessoais a terceiros.</strong>',
      description: 'Seus dados são utilizados exclusivamente dentro de nossa plataforma para fornecer os serviços de análise solicitados. Podemos compartilhar dados apenas nas seguintes circunstâncias:',
      items: [
        'Com seu consentimento expresso',
        'Quando exigido por lei ou ordem judicial',
        'Para proteger nossos direitos legais ou a segurança de usuários'
      ]
    },

    section5: {
      title: '5. Seus Direitos',
      description: 'Você tem os seguintes direitos sobre seus dados:',
      items: [
        '<strong>Acesso:</strong> Solicitar uma cópia dos dados que temos sobre você',
        '<strong>Correção:</strong> Solicitar a correção de dados imprecisos',
        '<strong>Exclusão:</strong> Solicitar a exclusão completa de seus dados',
        '<strong>Revogação:</strong> Revogar permissões de acesso a qualquer momento através das configurações do Instagram',
        '<strong>Portabilidade:</strong> Solicitar seus dados em formato legível por máquina'
      ],
      contact: `Para exercer qualquer um destes direitos, entre em contato conosco através do e-mail: <strong>${APP_CONSTANTS.emails.privacy}</strong>`
    },

    section6: {
      title: '6. Retenção de Dados',
      description: 'Mantemos seus dados apenas pelo tempo necessário para fornecer os serviços solicitados ou conforme exigido por lei. Você pode solicitar a exclusão de seus dados a qualquer momento, e eles serão removidos de nossos sistemas em até 30 dias.'
    },

    section7: {
      title: '7. Cookies e Tecnologias Similares',
      description: 'Utilizamos cookies e tecnologias similares apenas para funcionalidades essenciais do aplicativo, como manter sua sessão ativa e preferências de usuário. Não utilizamos cookies de terceiros para rastreamento ou publicidade.'
    },

    section8: {
      title: '8. Conformidade com a Meta Platform',
      description: 'Este aplicativo está em conformidade com os <a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">Termos da Plataforma Meta</a> e <a href="https://developers.facebook.com/policy" target="_blank" rel="noopener noreferrer">Política de Dados da Meta</a>. Respeitamos todas as limitações e requisitos impostos pela API do Instagram.'
    },

    section9: {
      title: '9. Alterações nesta Política',
      description: 'Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do aplicativo ou por e-mail. A versão mais recente estará sempre disponível nesta página com a data de atualização.'
    },

    section10: {
      title: '10. Contato',
      description: 'Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados, entre em contato:',
      email: `<strong>E-mail:</strong> ${APP_CONSTANTS.emails.privacy}`,
      support: `<strong>Suporte:</strong> ${APP_CONSTANTS.emails.support}`
    },

    homeLink: '🏠 Home',
    termsLink: '📋 Termos de Uso',
    dataDeletionLink: '🗑️ Exclusão de Dados'
  },

  // Data Deletion page
  dataDeletion: {
    backToHome: '← Voltar para Home',
    title: '🗑️ Solicitação de Exclusão de Dados',
    lastUpdated: `Última atualização: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Você tem o direito de solicitar a exclusão completa de seus dados da nossa plataforma. Esta página explica como fazer essa solicitação e o que esperar.',

    section1: {
      title: '1. Seu Direito à Exclusão de Dados',
      description: 'De acordo com as regulamentações de proteção de dados e políticas da Meta Platform, você pode solicitar a exclusão de todos os dados que coletamos sobre sua conta do Instagram. Isso inclui:',
      items: [
        'Informações de perfil (nome de usuário, nome de exibição, biografia)',
        'Dados de mídia (posts, fotos, vídeos, legendas)',
        'Métricas de engajamento (curtidas, comentários, visualizações)',
        'Todos os relatórios de análise e insights gerados',
        'Logs de acesso e histórico de uso'
      ]
    },

    section2: {
      title: '2. Como Solicitar a Exclusão de Dados',
      description: 'Para solicitar a exclusão de seus dados, siga estes passos:',
      steps: [
        `Envie um e-mail para <strong>${APP_CONSTANTS.emails.privacy}</strong>`,
        'Na linha de assunto, escreva: "Solicitação de Exclusão de Dados"',
        'No corpo do e-mail, inclua:',
        '• Seu nome de usuário do Instagram',
        '• O endereço de e-mail associado à sua conta (se aplicável)',
        '• Confirmação de que deseja todos os seus dados excluídos',
        'Confirmaremos o recebimento de sua solicitação em até 48 horas'
      ]
    },

    section3: {
      title: '3. Prazo de Processamento',
      description: 'Sua solicitação de exclusão de dados será processada de acordo com o seguinte cronograma:',
      items: [
        '<strong>Confirmação:</strong> Em até 48 horas após receber sua solicitação',
        '<strong>Processamento:</strong> Até 30 dias para remoção completa dos dados',
        '<strong>Notificação de Conclusão:</strong> Confirmação por e-mail quando a exclusão estiver completa',
        '<strong>Sistemas de Backup:</strong> Dados em sistemas de backup serão excluídos no próximo ciclo programado (até 90 dias)'
      ]
    },

    section4: {
      title: '4. O Que Acontece Após a Exclusão',
      warning: '<strong>Importante:</strong> A exclusão de dados é irreversível. Uma vez que seus dados sejam excluídos:',
      items: [
        'Você perderá acesso a todos os relatórios de análise e insights',
        'Dados históricos e métricas não estarão mais disponíveis',
        'Você precisará reautorizar o aplicativo para usar os serviços novamente',
        'Análises anteriores não podem ser recuperadas',
        'O processo de exclusão não pode ser desfeito'
      ]
    },

    section5: {
      title: '5. Revogando Permissões do Instagram',
      description: 'Além de solicitar a exclusão de dados de nossa plataforma, você também pode revogar o acesso do nosso aplicativo à sua conta do Instagram:',
      steps: [
        'Vá para as Configurações do Instagram',
        'Navegue até "Segurança" → "Apps e Sites"',
        'Encontre nosso aplicativo na lista',
        'Clique em "Remover" para revogar todas as permissões',
        'Nota: Isso não exclui os dados que já coletamos; você deve enviar uma solicitação de exclusão para isso'
      ]
    },

    section6: {
      title: '6. Exceções e Requisitos Legais',
      description: 'Podemos reter certas informações se exigido por lei ou para propósitos comerciais legítimos:',
      items: [
        'Dados necessários para cumprir obrigações legais',
        'Informações necessárias para resolver disputas ou fazer cumprir acordos',
        'Dados anonimizados usados para análise estatística (não podem identificá-lo)',
        'Logs de auditoria necessários para fins de segurança'
      ],
      note: 'Quaisquer dados retidos serão limitados ao que é legalmente exigido e serão mantidos seguros.'
    },

    section7: {
      title: '7. Dúvidas ou Problemas',
      description: `Se você tiver dúvidas sobre o processo de exclusão de dados ou encontrar algum problema, entre em contato conosco em <strong>${APP_CONSTANTS.emails.support}</strong>`,
      response: 'Responderemos à sua consulta em até 2 dias úteis.'
    },

    section8: {
      title: '8. Conformidade com a Meta Platform',
      description: `Este processo de exclusão de dados está em conformidade com os <a href="https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback" target="_blank" rel="noopener noreferrer">Requisitos de Exclusão de Dados da Meta Platform</a>. Para mais informações sobre seus direitos, consulte nossa <a href="/privacy">Política de Privacidade</a>.`
    },

    homeLink: '🏠 Home',
    privacyLink: '🔒 Política de Privacidade',
    termsLink: '📋 Termos de Uso'
  },

  // Terms page
  terms: {
    backToHome: '← Voltar para Home',
    title: '📋 Termos de Uso',
    lastUpdated: `Última atualização: ${APP_CONSTANTS.lastUpdated}`,
    intro: 'Bem-vindo ao nosso aplicativo de análise de Instagram. Ao utilizar este serviço, você concorda com os termos e condições descritos abaixo.',

    section1: {
      title: '1. Aceitação dos Termos',
      description: 'Ao acessar e utilizar este aplicativo, você aceita e concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concorda com algum destes termos, está proibido de usar ou acessar este serviço.',
      warning: '<strong>Atenção:</strong> O uso deste aplicativo implica em aceitação automática destes termos. Por favor, leia-os cuidadosamente.'
    },

    section2: {
      title: '2. Descrição do Serviço',
      description: 'Este aplicativo fornece ferramentas de análise para dados públicos do Instagram, coletados através da API oficial da Meta Platform. Os serviços incluem:',
      items: [
        'Coleta automatizada de dados de posts e perfis do Instagram',
        'Análise de métricas de engajamento e alcance',
        'Geração de relatórios e dashboards personalizados',
        'Insights sobre desempenho de conteúdo e audiência'
      ]
    },

    section3: {
      title: '3. Requisitos de Uso',
      description: 'Para utilizar este serviço, você deve:',
      items: [
        'Ter pelo menos 18 anos de idade ou a maioridade legal em sua jurisdição',
        'Possuir uma conta ativa do Instagram',
        'Ter autorização para acessar os dados que serão analisados',
        'Concordar com os Termos de Serviço do Instagram e da Meta Platform',
        'Não utilizar o serviço para fins ilegais ou não autorizados'
      ]
    },

    section4: {
      title: '4. Autenticação e Permissões',
      description: 'Você autoriza este aplicativo a acessar seus dados do Instagram através do processo de autenticação OAuth da Meta. Você pode:',
      items: [
        'Revogar as permissões a qualquer momento através das configurações do Instagram',
        'Controlar quais dados são compartilhados durante o processo de autorização',
        'Solicitar a exclusão de todos os dados coletados'
      ],
      note: '<strong>Importante:</strong> A revogação das permissões pode resultar na interrupção dos serviços de análise.'
    },

    section5: {
      title: '5. Uso Aceitável',
      description: 'Você concorda em NÃO:',
      items: [
        'Utilizar o serviço para violar quaisquer leis ou regulamentos aplicáveis',
        'Tentar acessar dados de contas que você não possui ou não está autorizado',
        'Fazer engenharia reversa, descompilar ou desmontar o aplicativo',
        'Utilizar o serviço para spam, fraude ou outras atividades maliciosas',
        'Sobrecarregar ou interferir com a infraestrutura do aplicativo',
        'Violar os Termos de Serviço do Instagram ou da Meta Platform',
        'Coletar dados de forma que viole a privacidade de outros usuários',
        'Revender ou redistribuir os dados ou serviços sem autorização'
      ]
    },

    section6: {
      title: '6. Limitações do Serviço',
      description: 'O aplicativo está sujeito às limitações impostas pela API do Instagram:',
      items: [
        'Limites de taxa de requisições (rate limits)',
        'Disponibilidade de dados conforme políticas da Meta',
        'Mudanças nas funcionalidades da API',
        'Possíveis interrupções por manutenção ou atualizações'
      ],
      note: 'Não garantimos disponibilidade ininterrupta do serviço e nos reservamos o direito de modificar, suspender ou descontinuar funcionalidades a qualquer momento.'
    },

    section7: {
      title: '7. Propriedade Intelectual',
      yourData: '<strong>Seus Dados:</strong> Você mantém todos os direitos sobre os dados do seu Instagram. Nós não reivindicamos propriedade sobre seu conteúdo.',
      ourService: '<strong>Nosso Serviço:</strong> O aplicativo, incluindo seu código, design, marca e funcionalidades, é de nossa propriedade exclusiva e protegido por leis de propriedade intelectual.'
    },

    section8: {
      title: '8. Limitação de Responsabilidade',
      description: 'Este serviço é fornecido "COMO ESTÁ" e "CONFORME DISPONÍVEL". Não garantimos:',
      items: [
        'Precisão ou completude dos dados coletados',
        'Disponibilidade contínua do serviço',
        'Adequação para qualquer propósito específico',
        'Ausência de erros ou interrupções'
      ],
      warning: '<strong>Importante:</strong> Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar este serviço.'
    },

    section9: {
      title: '9. Conformidade com a Meta Platform',
      description: 'Este aplicativo opera em conformidade com:',
      items: [
        '<a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer">Termos da Plataforma Meta</a>',
        '<a href="https://developers.facebook.com/policy" target="_blank" rel="noopener noreferrer">Política da Plataforma Meta</a>',
        '<a href="https://help.instagram.com/581066165581870" target="_blank" rel="noopener noreferrer">Termos de Uso do Instagram</a>',
        'Instagram Graph API - Termos e Limitações'
      ],
      note: 'Quaisquer violações destes termos podem resultar em suspensão ou encerramento do acesso ao aplicativo.'
    },

    section10: {
      title: '10. Privacidade e Proteção de Dados',
      description: 'O uso de seus dados é regido por nossa <a href="/privacy">Política de Privacidade</a>. Ao usar este serviço, você também concorda com os termos de nossa política de privacidade.'
    },

    section11: {
      title: '11. Suspensão e Encerramento',
      description: 'Reservamo-nos o direito de suspender ou encerrar seu acesso ao serviço, a qualquer momento e sem aviso prévio, se:',
      items: [
        'Você violar estes Termos de Uso',
        'Você violar os termos da Meta Platform ou Instagram',
        'Seu uso representar um risco de segurança ou legal',
        'Você realizar atividades fraudulentas ou abusivas'
      ]
    },

    section12: {
      title: '12. Modificações nos Termos',
      description: 'Podemos atualizar estes Termos de Uso periodicamente para refletir mudanças em nossos serviços ou requisitos legais. Mudanças significativas serão comunicadas através de:',
      items: [
        'Notificação dentro do aplicativo',
        'E-mail para o endereço cadastrado',
        'Atualização da data nesta página'
      ],
      note: 'O uso continuado do serviço após mudanças constitui aceitação dos novos termos.'
    },

    section13: {
      title: '13. Lei Aplicável',
      description: 'Estes termos são regidos e interpretados de acordo com as leis do Brasil. Quaisquer disputas relacionadas a estes termos serão resolvidas nos tribunais competentes do Brasil.'
    },

    section14: {
      title: '14. Contato',
      description: 'Para dúvidas, suporte ou questões relacionadas a estes Termos de Uso:',
      support: `<strong>E-mail de Suporte:</strong> ${APP_CONSTANTS.emails.support}`,
      legal: `<strong>E-mail Legal:</strong> ${APP_CONSTANTS.emails.legal}`
    },

    versionInfo: {
      lastUpdate: `<strong>Última Atualização:</strong> ${APP_CONSTANTS.lastUpdated}`,
      version: `<strong>Versão:</strong> ${APP_CONSTANTS.version}`,
      effectiveDate: `<strong>Data de Vigência:</strong> ${APP_CONSTANTS.effectiveDate}`
    },

    homeLink: '🏠 Home',
    privacyLink: '🔒 Política de Privacidade'
  },

  // Dashboard page
  dashboard: {
    backToHome: '← Voltar para Home',
    title: 'Dashboard Instagram Business',
    subtitle: 'Conecte sua conta Instagram Business para visualizar dados de perfil, insights de engajamento e comentários usando a API da Meta.',
    connectButton: 'Conectar Instagram Business',
    disconnectButton: 'Desconectar',
    connected: 'Conectado',
    howItWorks: 'Como Funciona — Permissões Utilizadas',

    // Permission descriptions
    permBasicDesc: 'Ler informações do perfil, seguidores e posts recentes.',
    permInsightsDesc: 'Acessar alcance, impressões e visualizações do perfil da conta.',
    permCommentsDesc: 'Ler comentários dos seus posts.',
    permPagesDesc: 'Necessário para encontrar a Página do Facebook vinculada à sua conta Instagram Business.',

    // Profile section
    profileTitle: 'Perfil Básico',
    followers: 'Seguidores',
    following: 'Seguindo',
    posts: 'Posts',

    // Insights section
    insightsTitle: 'Insights de Engajamento',
    insightsPeriod: 'Dados agregados — últimos 28 dias',
    reach: 'Alcance',
    accountsEngaged: 'Contas Engajadas',
    profileViews: 'Visualizações do Perfil',

    // Comments section
    commentsTitle: 'Comentários do Post',
    selectPost: 'Selecione um post para ver os comentários:',
    noComments: 'Nenhum comentário encontrado para este post.',

    // Errors
    errors: {
      noPages: 'Nenhuma Página do Facebook encontrada. Certifique-se de que sua conta tem uma Página do Facebook vinculada.',
      noIgBusiness: 'Nenhuma conta Instagram Business vinculada a esta Página do Facebook.'
    },

    // Nav
    homeLink: 'Home',
    privacyLink: 'Privacidade',
    termsLink: 'Termos'
  }
};
