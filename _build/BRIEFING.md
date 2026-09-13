<!-- Briefing original do Benjamin, colado no chat em 2026-09-12.
     Recuperado em 2026-09-12 da transcricao da sessao
     f76cc1b8-6987-4da6-9d69-78a721185719. Verbatim, nada editado. -->

construa um site do zero da enagemend na pasta site da enagegemend bunito utilize essas skil para fazer um site muito bem feito considere trabalho concluido qunado o site estiver com um design lindo e n algo com cara de vibecodado e simples como os outros # Prompt para o Claude Code — Site EngageMend

> Copie tudo abaixo da linha e cole no Claude Code.
> Se você já tiver rodado o Claude Design antes, anexe o handoff junto — este prompt funciona com ou sem ele.

---

## 0. COMO EU QUERO QUE VOCÊ TRABALHE

- **Construa em fases** (seção 11). Ao fim de cada fase, pare, me mostre o que ficou pronto e espere meu OK antes da próxima. Não construa o site inteiro de uma vez.
- **Não instale dependência que não esteja na lista da seção 2** sem me perguntar antes.
- **Não invente conteúdo.** Todo o texto do site está na seção 9, copiado do site atual. Se sobrar espaço numa seção, corte a seção — não escreva texto genérico para preencher.
- Rode `npm run build` antes de dizer que uma fase acabou. Erro de tipo ou de build é fase não entregue.
- Ambiente: **Windows**. Use comandos que funcionem no PowerShell.

---

## 1. O QUE É O PROJETO

Site institucional da **EngageMend**, em português do Brasil, **3 rotas**: `/`, `/sobre`, `/servicos`.

A EngageMend fomenta empreendedorismo e inovação em cidades de até 50 mil habitantes, com jovens de 14 a 19 anos. Monta "maratonas de criação" (midiathons e hackathons) onde os jovens resolvem um desafio real da cidade em poucos dias.

**Quem visita:** prefeitura, secretaria de educação, diretor de escola, produtor de evento, empresário de cidade pequena. Adulto, ocupado, cético, na maioria das vezes no celular. O jovem é o meio, não o cliente.

**Importante — não tem back-end.** O contato é um link `mailto`/Gmail compose, não um formulário. Logo: sem API route, sem banco, sem reCAPTCHA, sem banner de LGPD (o site não coleta dado nenhum). Se você achar que precisa de algo disso, me pergunte antes.

---

## 2. STACK

- **Next.js 14, App Router, TypeScript strict**
- **Tailwind CSS** — tokens no `tailwind.config.ts`, variáveis no `globals.css`
- **next/font/google** para as fontes (sem `<link>` manual, sem FOUT)
- **Lenis** — scroll suave
- **GSAP + ScrollTrigger** — animações presas ao scroll
- Deploy: **Netlify** (o site atual já está lá)

Nada além disso. Sem Framer Motion junto do GSAP — escolha uma biblioteca de animação e vá até o fim com ela.

---

## 3. ESTRUTURA DE ARQUIVOS

```
app/
  layout.tsx            — fontes, metadata base, Header, Footer, SmoothScroll
  page.tsx              — Home
  sobre/page.tsx        — Nós
  servicos/page.tsx     — Serviços
  globals.css           — tokens + base
components/
  layout/Header.tsx
  layout/Footer.tsx
  layout/SmoothScroll.tsx      — provider do Lenis
  ui/Button.tsx
  ui/RevealText.tsx            — masked reveal reutilizável
  ui/Counter.tsx               — contador animado
  ui/ScrollProgress.tsx        — barra lateral (elemento de assinatura)
  sections/...                 — uma pasta por seção
lib/
  content.ts            — TODO o texto do site, tipado, em um lugar só
  animations.ts         — durações, easings e helpers do GSAP
```

**Regra:** nenhum texto de conteúdo fica hardcoded dentro de JSX. Tudo sai de `lib/content.ts`. Assim dá para revisar copy sem abrir componente.

---

## 4. TOKENS — TRÊS CORES, NADA ALÉM DISSO

```css
:root {
  --base:   #FBF8F1;  /* fundo — 60% da tela */
  --ink:    #102C26;  /* texto e blocos escuros — 30% */
  --accent: #C4B72A;  /* mostarda — 10% */
}
```

**Não existe quarta cor.** Sem cinza, sem branco puro, sem segundo verde. Toda variação é opacidade de `--ink` (configure no Tailwind como `ink/70`, `ink/12`, `ink/4`):

| Papel | Valor | Contraste sobre `--base` |
|---|---|---|
| Texto de leitura | `ink` | 13,7:1 |
| Texto secundário, rótulo, legenda | `ink/70` | 5,4:1 — passa AA |
| Borda, filete, divisória | `ink/12` | decorativo |
| Seção alternada | `ink/4` | fundo levemente mais quente |

**Regras que não podem ser quebradas (são medidas, não gosto):**
- `accent` sobre `base` dá **1,9:1 — ilegível**. Mostarda nunca é cor de texto sobre o fundo claro. Só existe preenchida: fundo de botão, bloco sólido, filete grosso, marcador, preenchimento de barra.
- Texto dentro de área mostarda é `ink` (7,2:1). Sempre.
- Em fundo `ink`, o texto é `base`. Só ali a mostarda pode virar texto, e apenas em rótulo pequeno.
- Anel de foco é 2px em `ink`. Nunca mostarda — ela não tem contraste para isso.
- **Máximo 4 aparições de mostarda por tela.**

Espaçamento: escala de 8pt. Configure no Tailwind e use só a escala — nada de `p-[13px]`.
Raio: 4px em tudo (`rounded` customizado). Sem `box-shadow` difusa em lugar nenhum.

---

## 5. TIPOGRAFIA

Duas famílias via `next/font/google`, três papéis:

- **Plus Jakarta Sans 800** (`--font-display`) — só H1 e H2. Tracking -0.03em nos tamanhos grandes, line-height 0.95–1.05.
- **Inter 400/500/600** (`--font-body`) — parágrafo, lista, tabela, botão, navegação. Line-height 1.6, largura máxima 65ch. Nunca peso 800.
- **Rótulo** — Inter 500, 12px, caixa alta, tracking +0.12em, cor `ink/70`. Numeral das etapas, eyebrow de seção, rótulo de métrica.

Escala fixa, configurada no Tailwind, sem valor fora dela:
`12 · 14 · 16 · 20 · 24 · 32 · 48 · 72 · 112`

H1 da Home: 112px desktop / 44px mobile. H2: 48px / 32px. Corpo: 18px / 16px.

---

## 6. LAYOUT E COMPONENTES

- Container máximo 1200px, respiro lateral generoso, 24px de margem no mobile.
- Respiro vertical entre seções: 120px desktop / 64px mobile.

**Header (em `layout.tsx`, nas 3 rotas):**
Logo à esquerda (`<Link href="/">`). No canto superior direito, dois links de texto: **Nós** (`/sobre`) e **Serviços** (`/servicos`). São links com sublinhado que cresce no hover, não botões preenchidos. O único botão preenchido é o CTA, e ele não fica no header. No mobile os dois links continuam visíveis — com dois itens não existe motivo para hambúrguer. Marque a rota ativa.

**Footer (nas 3 rotas, idêntico):**
Logo + "Fomentamos empreendedorismo e inovação em cidades de até 50 mil habitantes, com jovens de 14 a 19 anos."
Três links, todos com `rel="noopener noreferrer"` e `target="_blank"` nos externos:
- LinkedIn — https://www.linkedin.com/company/engagemend/home/
- Instagram — https://www.instagram.com/engage_mend/
- E-mail — engagemend@gmail.com
Linha final: "© 2026 EngageMend. Todos os direitos reservados."

**Composição:** as 3 rotas compartilham header, footer, tokens, escala e ritmo. O que muda é o arranjo do grid, onde entra o bloco escuro e qual é o efeito de destaque. Não repita o mesmo empilhamento de três seções nas três páginas.

---

## 7. SEO E METADATA

**As rotas `/sobre` e `/servicos` precisam continuar com esses mesmos caminhos.** O site atual já está indexado neles; mudar URL joga fora o pouco de sinal de busca que existe.

Use a Metadata API do Next. Valores exatos, por rota:

**`/`**
- title: `EngageMend - Empreendedorismo jovem em cidades pequenas`
- description: `A EngageMend fomenta empreendedorismo e inovação em cidades de até 50 mil habitantes. Trabalhamos com jovens de 14 a 19 anos: eles resolvem um desafio real da cidade em poucos dias, com método, orientação e entrega de verdade.`

**`/sobre`**
- title: `Quem somos - EngageMend`
- description: `Cinco estudantes de Pompeia (SP), interior de São Paulo, por trás da EngageMend.`

**`/servicos`**
- title: `Como funciona - EngageMend`
- description: `Como a EngageMend monta uma maratona de criação na sua cidade: as quatro etapas e os formatos midiathon e hackathon.`
- og:description: `Montamos uma maratona de criação na sua cidade. Jovens de 14 a 19 anos resolvendo um desafio real em poucos dias.`

Comum a todas: `locale: pt_BR`, `og:site_name: EngageMend`, `og:type: website`, `theme-color: #102C26`, keywords `empreendedorismo jovem, inovação em cidades pequenas, maratona de criação, midiathon, hackathon, EngageMend`.

Também: `sitemap.ts`, `robots.ts`, e JSON-LD de `Organization` no layout (nome, descrição, e-mail, perfis de Instagram e LinkedIn como `sameAs`). Um `<h1>` por rota, headings em ordem.

---

## 8. ANIMAÇÃO — O SITE É MUITO INTERATIVO

### Regras técnicas
- Anime **só** `transform`, `opacity` e `clip-path`. Nada que force reflow.
- Todo GSAP dentro de `useLayoutEffect` com `gsap.context()` e `revert()` no cleanup. Sem isso, a troca de rota do App Router deixa ScrollTrigger órfão e o scroll quebra.
- Integre o Lenis ao ScrollTrigger (`scrollerProxy` / `ScrollTrigger.update` no evento de scroll do Lenis) — senão os dois brigam.
- `ScrollTrigger.refresh()` depois que as fontes carregarem, ou os pontos de disparo saem errados.
- Entrada: 400–600ms, easing `expo.out`. Microinteração: 150–250ms. Stagger 60–80ms.
- Elemento de entrada anima **uma vez** (`once: true`). Não re-anima ao subir a página.
- `prefers-reduced-motion: reduce` → desliga Lenis e todas as animações, entrega tudo no estado final. Obrigatório, não opcional.
- **Orçamento: no máximo 2 ScrollTriggers com `scrub` por rota.** Mais que isso pesa o scroll no celular, que é onde o cliente vai abrir.
- Nada pisca, gira infinito ou sacode.

### Os efeitos
1. **Preloader com contador** — logo em fundo `ink`, número de 0% a 100% em display. No fim, cortina sobe com `clip-path` (700ms). Máximo 1,2s, só na primeira visita (guarde em `sessionStorage`).
2. **Masked reveal no H1** — cada linha em contêiner `overflow-hidden`, sobe de `translateY(100%)` com stagger. Componente `RevealText` reutilizável.
3. **Barra de progresso lateral — ELEMENTO DE ASSINATURA** — filete vertical de 2px fixo à esquerda em `ink/12`, preenchendo em `accent` conforme rola. Na seção das etapas ganha 4 marcadores que acendem quando cada etapa entra. É a régua da marca virando navegação. Capriche aqui.
4. **Texto que se preenche** *(scrub 1 da Home)* — no bloco do problema, o parágrafo vai de `ink/20` a `ink` palavra por palavra conforme rola.
5. **Pin com scrub nas 4 etapas** *(scrub 2 da Home)* — seção trava, etapas 01→04 avançam uma a uma, a anterior recua em opacidade e escala 0.96. Única seção com pin do site. **No mobile, desative o pin** e entregue lista vertical com reveal simples.
6. **Troca de cor de fundo no scroll** — ao entrar no bloco escuro, o fundo da página vai de `base` para `ink` e o texto inverte, em 500ms. Só nos 2 blocos escuros.
7. **Contadores** (`/sobre`) — sobem de 0 até o valor ao entrar na viewport, uma vez, ~1,2s com desaceleração.
8. **Botão com ímã leve** — desloca até **4px** na direção do cursor, volta ao sair. Hover: escurece 6% e sobe 2px. Desative no touch.
9. **Hover de links e cards** — sublinhado crescendo da esquerda; card de etapa com borda de `ink/12` para `ink/40` e numeral mostarda crescendo levemente.
10. **Reveal do vídeo por `clip-path`** — abre de faixa fina para retângulo, escala 1.06 → 1.
11. **Parallax discreto** — fundo a ~0.85 da velocidade do scroll, em uma ou duas seções. Se der para perceber, está forte demais.
12. **Transição entre rotas** — cortina `ink` sobe, cobre, desce revelando a nova página. 400ms de cada lado.

---

## 9. CONTEÚDO REAL — USE EXATAMENTE ESTE TEXTO

*(vai tudo em `lib/content.ts`)*

### ROTA `/` — HOME

**H1, em 4 linhas:**
> Cidade pequena não perde talento
> por falta de gente boa.
> Perde por falta
> de onde começar.

**Subtítulo:**
> A EngageMend fomenta empreendedorismo e inovação em cidades de até 50 mil habitantes. Trabalhamos com jovens de 14 a 19 anos: eles resolvem um desafio real da cidade em poucos dias, com método, orientação e entrega de verdade.

**Botão primário:** `Falar conosco →` → âncora `#contato`

---

**Bloco do problema** — H2 em 4 linhas:
> Por que tantos jovens talentosos
> precisam sair de suas cidades pequenas
> para conseguir estudar, trabalhar
> e construir um futuro?

> Em cidades com até 50 mil habitantes, muitos jovens não encontram boas oportunidades de emprego, empreendedorismo ou contato com empresas e profissionais.

> Por isso, eles acabam indo para cidades maiores em busca dessas oportunidades.

> A cidade perde seus jovens, e os jovens perdem a chance de construir um futuro sem precisar deixar sua comunidade.

---

**Etapas** — H2:
> Montamos uma maratona de criação na sua cidade.

**(01) Entender** — Conversamos com quem conhece a cidade e definimos o desafio. Nem sempre é o que parecia no começo.
**(02) Preparar** — Montamos as equipes, os temas e as regras. Cada equipe sabe o que precisa entregar e para quem.
**(03) Fazer** — Dias de trabalho intenso, com orientação nossa. Tudo que sai passa por revisão antes de ir ao público.
**(04) Entregar e medir** — Mostramos o resultado: o que foi produzido, quanta gente foi alcançada e quais jovens se destacaram.

**Fechamento da seção:**
> Não ensinamos empreendedorismo em palestra. Fazemos acontecer.

---

**Vídeo:** arquivo `/EngageMend.mp4` em `public/`. `<video>` com `poster`, `preload="metadata"`, sem autoplay, controles nativos. Moldura simples.

---

**Citação** (bloco escuro `ink`, texto `base`, display grande):
> Uma cidade não segura talento com discurso.
> Segura fazendo o jovem criar algo antes de ir embora.

**Parágrafo abaixo:**
> Quem sai da cidade aos 18 nunca viu ali um caminho que não fosse emprego público, comércio ou lavoura. Não é que ele rejeitou empreender: ele nunca viu isso acontecer perto dele. Empreendedorismo não se ensina em palestra, se aprende fazendo. Numa maratona com prazo, equipe e entrega real, quem tem esse perfil aparece sozinho. No fim, a cidade sabe quem são esses jovens, e eles descobrem isso sobre si mesmos.

---

**Contato** (`id="contato"`) — H2 em 2 linhas:
> Sua cidade tem um evento
> ou um problema este ano?

> Conversa de 20 minutos, sem compromisso. Ouvimos o caso e dizemos com franqueza se dá para montar algo.

**Botão primário:** `Agendar conversa →`
Destino (link de composição do Gmail, já com assunto e corpo preenchidos):
`https://mail.google.com/mail/?view=cm&fs=1&to=engagemend%40gmail.com&su=Quero%20levar%20a%20EngageMend%20para%20minha%20cidade&body=Ol%C3%A1!%20Quero%20saber%20como%20a%20EngageMend%20pode%20ajudar%20minha%20cidade.%0A%0ACidade%3A%20%0AEscola%20ou%20grupo%20de%20jovens%20parceiro%3A%20%0AEvento%20ou%20desafio%20que%20voc%C3%AA%20tem%20em%20mente%3A%20%0A`

**Abaixo:** ou escreva para engagemend@gmail.com

---

### ROTA `/sobre` — NÓS

**Eyebrow:** Quem somos

**H1:**
> A gente é a idade do problema.

**Subtítulo:**
> Cinco estudantes de uma cidade de 20 mil habitantes, tentando resolver o que quase levou cada um de nós embora.

> Somos cinco estudantes. Quatro no ensino médio da Escola SENAI Shunji Nishimura, um na Fatec Pompeia. Todos em Pompeia, interior de São Paulo.

> A gente não foi embora. E não foi por sorte: foi porque aqui existe onde estudar tecnologia sem sair de casa. Somos o resultado de uma coisa que deu certo nesta cidade.

> A EngageMend nasceu da pergunta seguinte: e as cidades onde isso não existe?

**Três métricas com contador:**
| Número | Rótulo |
|---|---|
| 5 | estudantes fundadores |
| 20 mil | habitantes na cidade onde começamos |
| 2026 | ano de fundação |

O "2026" é ano, não quantidade: anime sem separador de milhar e sem formatação de número.

**Citação de fechamento** (bloco escuro):
> Nenhuma prova de que isso funciona vem de nós. Vem de Pompeia.

---

### ROTA `/servicos` — SERVIÇOS

**H1, em 3 linhas:**
> Montamos uma
> maratona de criação
> na sua cidade.

> Reunimos jovens de 14 a 19 anos, normalmente alunos de uma escola parceira, e damos a eles um desafio real da cidade: divulgar um evento, criar uma solução para um problema local, mostrar o trabalho de quem produz na região.

> Eles trabalham em equipes, com prazo, orientação e critério. No fim, o que produzem vai para a rua de verdade: é publicado, é apresentado, é usado.

**H2:** As quatro etapas
Mesmos 4 textos 01–04 da Home, vindos do mesmo objeto em `lib/content.ts` — **não duplique o texto**. Layout diferente aqui: lista vertical numerada com linha de conexão que se desenha conforme o scroll.

**H2:** Na prática

| Campo | Valor |
|---|---|
| Duração | Definida junto com a cidade |
| Idade | 14 a 19 anos (ensino médio e fundamental 2) |
| O que você precisa ter | Uma escola ou grupo de jovens parceiro, um espaço e uma pessoa de contato |
| O que você recebe | Definido junto com a cidade |
| Menores de idade | Todo projeto tem autorização dos responsáveis para uso de imagem e acompanhamento de professores da escola |
| Investimento | Definido junto com a cidade |

Os três "Definido junto com a cidade" são intencionais — o escopo é fechado com o cliente. Trate como resposta normal, **não** como campo vazio: nada de traço, interrogação ou cor apagada. Abaixo da tabela, uma linha de apoio: *"O escopo é fechado com cada cidade na conversa inicial."*

**H2:** Os formatos

**Midiathon** — Quando o desafio é comunicação. Os jovens produzem o conteúdo que divulga um evento, uma causa ou um trabalho da região.

**Hackathon** — Quando o desafio pede solução. Os jovens criam algo que resolve um problema da cidade: um aplicativo, um serviço, uma ideia de negócio.

> A escolha depende do que a cidade precisa naquele momento. O método é o mesmo nos dois.

**Fechamento** — H2: Pronto para começar?
> Conversa de 20 minutos, sem compromisso. Ouvimos o caso e dizemos com franqueza se dá para montar algo.

**Botão primário:** `Agendar conversa →` (mesmo link do Gmail da Home)

---

## 10. ACESSIBILIDADE E PERFORMANCE — CRITÉRIO DE ACEITE

- Navegação completa por teclado. Anel de foco visível de 2px em `ink` com 2px de deslocamento. Nunca `outline: none` sem substituto.
- Alvo de toque mínimo 44×44px no mobile.
- Semântica: `<button>` para ação, `<a>`/`<Link>` para navegação, `alt` em toda imagem, um `<h1>` por rota, headings em ordem.
- Zero scroll horizontal em qualquer largura de 320px para cima.
- **O site funciona com JavaScript desligado** — conteúdo renderizado no servidor, animação é camada. Isso também garante que o Google leia tudo.
- Sem layout shift: reserve altura de vídeo e imagens (CLS ~0).
- Lighthouse mobile: Performance ≥ 90, Acessibilidade 100, SEO 100.

---

## 11. FASES

**Fase 1 — Fundação.** Projeto Next.js, TypeScript strict, Tailwind com os tokens, fontes via next/font, `lib/content.ts` com todo o texto, Header e Footer, as 3 rotas vazias com metadata correta. Sem animação nenhuma.

**Fase 2 — Home estática.** Todas as seções da Home, desktop e mobile, semântica correta, zero animação. É aqui que a hierarquia tem que ficar certa — animar layout errado só esconde o problema.

**Fase 3 — `/sobre` e `/servicos` estáticas.**

**Fase 4 — Camada de scroll.** Lenis + GSAP integrados, `prefers-reduced-motion`, cleanup por rota. Só depois disso os efeitos 1 a 12, na ordem em que estão listados.

**Fase 5 — Acerto final.** Lighthouse, teste de teclado, teste em 320px, `sitemap.ts`, `robots.ts`, JSON-LD, build de produção limpo.

Comece pela **Fase 1** e me mostre o resultado antes de seguir.