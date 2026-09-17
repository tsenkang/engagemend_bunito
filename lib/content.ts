/**
 * Todo o texto visível do site mora aqui. Nenhuma string de conteúdo
 * é escrita dentro de JSX, para que a copy possa ser revisada sem
 * abrir um componente.
 */

export type Step = {
  readonly numeral: string;
  readonly title: string;
  readonly body: string;
};

export type Metric = {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  /** `year` não leva separador de milhar. */
  readonly kind: 'count' | 'year';
};

export type PracticeRow = {
  readonly field: string;
  readonly value: string;
};

export type Format = {
  readonly name: string;
  readonly body: string;
};

export type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
};

/**
 * Assunto e corpo do primeiro contato, escritos uma vez só.
 *
 * As três perguntas são o que qualifica a conversa, e é por isso que
 * elas vão junto no corpo: quem responde já sabe de qual cidade se
 * trata antes da primeira resposta.
 */
const assunto = 'Quero levar a EngageMend para minha cidade';
const corpo =
  'Olá! Quero saber como a EngageMend pode ajudar minha cidade.\n\n' +
  'Cidade: \nEscola ou grupo de jovens parceiro: \n' +
  'Evento ou desafio que você tem em mente: \n';

const destinatario = 'engagemend@gmail.com';

export const site = {
  name: 'EngageMend',
  email: destinatario,
  /**
   * **O caminho primário do site inteiro, e por isso é `mailto:`.**
   *
   * Era o compositor do Gmail. Quem não estivesse logado numa conta
   * Google — prefeitura em Outlook ou Zimbra, navegador corporativo,
   * celular sem Gmail configurado — caía numa tela de login em vez de
   * escrever, no único ponto de conversão que o site tem. O `mailto:`
   * abre o programa de e-mail de quem tem um e abre o próprio Gmail
   * para quem usa Gmail no navegador.
   */
  mailto: `mailto:${destinatario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`,
  /** O compositor do Gmail, agora como alternativa e não como porta. */
  compose:
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destinatario)}` +
    `&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`,
  linkedin: 'https://www.linkedin.com/company/engagemend/home/',
  instagram: 'https://www.instagram.com/engage_mend/',
} as const;

/**
 * O fecho de agendar, escrito uma vez.
 *
 * `/servicos` terminava nele e `/sobre` não terminava em nada — a rota
 * onde o cético decide se confia entregava o visitante ao rodapé, no
 * ponto em que a vontade de agir é maior. Agora as duas rotas de dentro
 * fecham no mesmo bloco, com as mesmas palavras, e as palavras moram
 * aqui em vez de em dois lugares que envelhecem separados.
 */
export const schedule = {
  headline: 'Pronto para começar?',
  body: 'Conversa de 20 minutos, sem compromisso. Ouvimos o caso e dizemos com franqueza se dá para montar algo.',
  cta: { label: 'Agendar conversa', href: site.mailto },
} as const;

/**
 * O que fica embaixo do botão, nos três fechos e numa fonte só.
 *
 * O botão é um `mailto:`, e um `mailto:` não abre nada em máquina sem
 * programa de e-mail configurado. **Isso deixou de ser caso raro:** a
 * Microsoft aposentou o Correio do Windows, e máquina nova chega sem
 * handler nenhum para o protocolo — o clique não falha, ele não tem para
 * onde ir, e nada avisa o visitante. Aconteceu na máquina do Benjamin,
 * com o handler apontando para um ProgId que não existe mais.
 *
 * O público deste site é secretaria de prefeitura e escola, quase toda
 * em webmail. Por isso o endereço aparece **em texto, não como link:**
 * texto não depende de cliente de e-mail, nem de conta Google, nem de
 * clique. É o chão que funciona sempre. O botão e o Gmail são atalhos
 * por cima dele, e um atalho pode falhar sem levar a conversão junto.
 */
export const contactSupport = {
  /** O que acontece depois do clique. Ninguém dizia. */
  note: 'Abre seu e-mail com as perguntas já escritas.',
  fallbackPrefix: 'Ou escreva direto para',
  gmailLabel: 'Abrir no Gmail',
} as const;

export const nav: readonly { label: string; href: string }[] = [
  { label: 'Nós', href: '/sobre' },
  { label: 'Serviços', href: '/servicos' },
];

/** As quatro etapas aparecem na Home e em /servicos. Um texto só. */
export const steps: readonly Step[] = [
  {
    numeral: '01',
    title: 'Entender',
    body: 'Conversamos com quem conhece a cidade e definimos o desafio. Nem sempre é o que parecia no começo.',
  },
  {
    numeral: '02',
    title: 'Preparar',
    body: 'Montamos as equipes, os temas e as regras. Cada equipe sabe o que precisa entregar e para quem.',
  },
  {
    numeral: '03',
    title: 'Fazer',
    body: 'Dias de trabalho intenso, com orientação nossa. Tudo que sai passa por revisão antes de ir ao público.',
  },
  {
    numeral: '04',
    title: 'Entregar e medir',
    body: 'Mostramos o resultado: o que foi produzido, quanta gente foi alcançada e quais jovens se destacaram.',
  },
];

/**
 * Vocabulário de sinalização: numerais das seções e a faixa rolante.
 *
 * Nenhuma palavra nova — são as mesmas expressões das keywords da
 * seção 7 do briefing e do corpo do texto. Rótulo é estrutura, não
 * conteúdo, e mesmo assim não vale inventar.
 */
/**
 * Rótulos de seção. São numerais mais uma expressão que já existe no
 * texto ou nas keywords do briefing — sinalização, não copy nova. A
 * única exceção é "role para descer", que é instrução de uso.
 */
export const labels = {
  heroLeft: 'Empreendedorismo jovem',
  heroRight: 'Cidades de até 50 mil habitantes',
  scroll: 'Role para descer',
  problem: '01 — Cidades de até 50 mil habitantes',
  method: '02 — Maratona de criação',
  quote: '03 — Empreendedorismo se aprende fazendo',
  contact: '04 — Falar conosco',
  sobre: '01 — Quem somos',
  metrics: '02 — Pompeia, interior de São Paulo',
  servicosIntro: 'Maratona de criação',
  servicosSteps: '01 — As quatro etapas',
  servicosPractice: '02 — Na prática',
  servicosFormats: '03 — Midiathon e hackathon',
  servicosClosing: '04 — Agendar conversa',
  sobreSchedule: '03 — Agendar conversa',
} as const;

export const marquee: readonly string[] = [
  'Empreendedorismo jovem',
  'Inovação em cidades pequenas',
  'Maratona de criação',
  'Midiathon',
  'Hackathon',
];

export const home = {
  hero: {
    /**
     * As quebras do H1 são desenho, não acaso — mas foram refeitas.
     *
     * O briefing fixa quatro linhas, pensadas para 112px em caixa
     * normal. Em caixa alta, medido no navegador, a linha mais longa
     * dessas quatro trava a manchete em 89px: ela ocupa um terço da
     * primeira tela e o resto fica vazio. Estas cinco quebras têm a
     * mesma ordem de palavras, nenhuma palavra a mais ou a menos, e
     * deixam a manchete em 133px ocupando a tela como deve.
     */
    headline: [
      'Cidade pequena',
      'não perde talento',
      'por falta de gente boa.',
      'Perde por falta',
      'de onde começar.',
    ],
    lead: 'A EngageMend fomenta empreendedorismo e inovação em cidades de até 50 mil habitantes. Trabalhamos com jovens de 14 a 19 anos: eles resolvem um desafio real da cidade em poucos dias, com método, orientação e entrega de verdade.',
    cta: { label: 'Falar conosco', href: '#contato' },
  },
  problem: {
    headline: [
      'Por que tantos jovens talentosos',
      'precisam sair de suas cidades pequenas',
      'para conseguir estudar, trabalhar',
      'e construir um futuro?',
    ],
    paragraphs: [
      'Em cidades com até 50 mil habitantes, muitos jovens não encontram boas oportunidades de emprego, empreendedorismo ou contato com empresas e profissionais.',
      'Por isso, eles acabam indo para cidades maiores em busca dessas oportunidades.',
      'A cidade perde seus jovens, e os jovens perdem a chance de construir um futuro sem precisar deixar sua comunidade.',
    ],
  },
  method: {
    headline: 'Montamos uma maratona de criação na sua cidade.',
    closingLead: 'Não ensinamos empreendedorismo em palestra.',
    closingPunch: 'Fazemos acontecer.',
    /** Instrução de uso, não conteúdo: só aparece quando há o que arrastar. */
    deckHint: 'Arraste os cartões',
  },
  quote: {
    lines: [
      'Uma cidade não segura talento com discurso.',
      'Segura fazendo o jovem criar algo antes de ir embora.',
    ],
    body: 'Quem sai da cidade aos 18 nunca viu ali um caminho que não fosse emprego público, comércio ou lavoura. Não é que ele rejeitou empreender: ele nunca viu isso acontecer perto dele. Empreendedorismo não se ensina em palestra, se aprende fazendo. Numa maratona com prazo, equipe e entrega real, quem tem esse perfil aparece sozinho. No fim, a cidade sabe quem são esses jovens, e eles descobrem isso sobre si mesmos.',
  },
  contact: {
    id: 'contato',
    headline: ['Sua cidade tem um evento', 'ou um problema este ano?'],
    body: 'Conversa de 20 minutos, sem compromisso. Ouvimos o caso e dizemos com franqueza se dá para montar algo.',
    cta: { label: 'Agendar conversa', href: site.mailto },
  },
} as const;

export const sobre = {
  eyebrow: 'Quem somos',
  /**
   * Em duas linhas porque a manchete não reflui: a escala de `.d-hero`
   * é calibrada pela linha mais longa da Home, e esta frase inteira
   * numa linha só passava da margem e era cortada.
   */
  headline: ['A gente é a idade', 'do problema.'],
  lead: 'Cinco estudantes de uma cidade de 20 mil habitantes, tentando resolver o que quase levou cada um de nós embora.',
  paragraphs: [
    'Somos cinco estudantes. Quatro no ensino médio da Escola SENAI Shunji Nishimura, um na Fatec Pompeia. Todos em Pompeia, interior de São Paulo.',
    'A gente não foi embora. E não foi por sorte: foi porque aqui existe onde estudar tecnologia sem sair de casa. Somos o resultado de uma coisa que deu certo nesta cidade.',
    'A EngageMend nasceu da pergunta seguinte: e as cidades onde isso não existe?',
  ],
  metrics: [
    { value: 5, suffix: '', label: 'estudantes fundadores', kind: 'count' },
    { value: 20, suffix: ' mil', label: 'habitantes na cidade onde começamos', kind: 'count' },
    { value: 2026, suffix: '', label: 'ano de fundação', kind: 'year' },
  ] satisfies readonly Metric[],
  /** Título da faixa de números. Só para leitor de tela: quem o vê é o rótulo. */
  metricsHeading: 'Pompeia, interior de São Paulo',
  quote: 'Nenhuma prova de que isso funciona vem de nós. Vem de Pompeia.',
} as const;

export const servicos = {
  headline: ['Montamos uma', 'maratona de criação', 'na sua cidade.'],
  paragraphs: [
    'Reunimos jovens de 14 a 19 anos, normalmente alunos de uma escola parceira, e damos a eles um desafio real da cidade: divulgar um evento, criar uma solução para um problema local, mostrar o trabalho de quem produz na região.',
    'Eles trabalham em equipes, com prazo, orientação e critério. No fim, o que produzem vai para a rua de verdade: é publicado, é apresentado, é usado.',
  ],
  stepsHeadline: 'As quatro etapas',
  practiceHeadline: 'Na prática',
  practice: [
    { field: 'Duração', value: 'Definida junto com a cidade' },
    { field: 'Idade', value: '14 a 19 anos (ensino médio e fundamental 2)' },
    {
      field: 'O que você precisa ter',
      value: 'Uma escola ou grupo de jovens parceiro, um espaço e uma pessoa de contato',
    },
    { field: 'O que você recebe', value: 'Definido junto com a cidade' },
    {
      field: 'Menores de idade',
      value:
        'Todo projeto tem autorização dos responsáveis para uso de imagem e acompanhamento de professores da escola',
    },
    { field: 'Investimento', value: 'Definido junto com a cidade' },
  ] satisfies readonly PracticeRow[],
  practiceNote: 'O escopo é fechado com cada cidade na conversa inicial.',
  formatsHeadline: 'Os formatos',
  formats: [
    {
      name: 'Midiathon',
      body: 'Quando o desafio é comunicação. Os jovens produzem o conteúdo que divulga um evento, uma causa ou um trabalho da região.',
    },
    {
      name: 'Hackathon',
      body: 'Quando o desafio pede solução. Os jovens criam algo que resolve um problema da cidade: um aplicativo, um serviço, uma ideia de negócio.',
    },
  ] satisfies readonly Format[],
  formatsNote:
    'A escolha depende do que a cidade precisa naquele momento. O método é o mesmo nos dois.',
} as const;

/**
 * Sinalização da página de erro. Não é conteúdo do site — é o que se
 * escreve quando a URL não existe — mas mora aqui como todo o resto,
 * para a copy ficar revisável em um lugar só.
 */
export type NotFoundRoute = {
  readonly numeral: string;
  readonly label: string;
  readonly href: string;
  readonly body: string;
};

export const notFound = {
  status: 'Endereço não encontrado',
  code: 'Erro 404',
  title: 'Página não encontrada - EngageMend',
  /**
   * Duas linhas porque o tamanho de display só cabe frase curta, e
   * porque a quebra cai onde a frase já tinha pausa.
   */
  headline: ['Esta página', 'não existe.'],
  lead: 'O endereço mudou ou veio digitado errado. O site tem três páginas, e todas continuam aqui.',
  scroll: 'Role para escolher',
  routesLabel: '01 — Por onde voltar',
  /**
   * A descrição de cada rota sai do texto que já existe na página
   * correspondente. Nenhuma promessa nova: a 404 é sinalização.
   */
  routes: [
    {
      numeral: '01',
      label: 'Início',
      href: '/',
      body: 'O que a EngageMend faz, em uma tela.',
    },
    {
      numeral: '02',
      label: 'Nós',
      href: '/sobre',
      body: 'Cinco estudantes de uma cidade de 20 mil habitantes.',
    },
    {
      numeral: '03',
      label: 'Serviços',
      href: '/servicos',
      body: 'A maratona de criação, etapa por etapa.',
    },
  ] satisfies readonly NotFoundRoute[],
  helpPrefix: 'Chegou aqui por um link nosso? Conta pra gente:',
} as const;

export const footer = {
  tagline:
    'Fomentamos empreendedorismo e inovação em cidades de até 50 mil habitantes, com jovens de 14 a 19 anos.',
  links: [
    { label: 'LinkedIn', href: site.linkedin, external: true },
    { label: 'Instagram', href: site.instagram, external: true },
    /*
      O rótulo é o próprio endereço, e não a palavra "E-mail", pelo mesmo
      motivo do `contactSupport`: em máquina sem cliente de e-mail o
      clique não leva a lugar nenhum, e aí o que sobra é o que dá para
      ler. Assim o endereço aparece em todas as páginas do site. O `href`
      era um `mailto:` cru, sem assunto nem as três perguntas — era o
      único caminho do site que perdia a qualificação.
    */
    { label: site.email, href: site.mailto, external: true },
  ] satisfies readonly SocialLink[],
  copyright: '© 2026 EngageMend. Todos os direitos reservados.',
} as const;
