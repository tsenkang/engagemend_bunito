# HANDOFF — Site EngageMend (pasta `site_engagemend_bunito`)

Última sessão: 2026-09-12 (quinta passada). **Leia este arquivo inteiro antes
de tocar em qualquer coisa.**

O briefing original do Benjamin está em `_build/BRIEFING.md`, verbatim,
recuperado da transcrição. Ele continua sendo a fonte da verdade sobre
**conteúdo**. Sobre **visual**, ele foi substituído — ver abaixo.

---

## Onde está

As 5 fases construídas, build de produção limpo, três rotas estáticas.
Lighthouse mobile:

| Rota | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| `/` | 91 | 100 | 100 | 100 |
| `/servicos` | 94 | 100 | 100 | 100 |
| `/sobre` | 93 | 100 | 100 | 100 |

Meta do briefing: Performance ≥ 90, Acessibilidade 100, SEO 100. Batidas.
Sem scroll horizontal de 320px a 1440px nas três rotas.

> **Atenção: a tabela de Lighthouse acima é da terceira passada.** A quarta
> passada acrescentou `ContourField` (WebGL), `Cursor` e `Ramp`, e a
> Performance **não foi remedida desde então**. A Home já estava em 91, com 9
> pontos de folga, e um shader em laço contínuo é exatamente o que come essa
> folga. **Remeça antes de qualquer outra coisa.**

---

## A quinta passada (404 e dois defeitos de verdade)

**A página 404 foi feita**, e no caminho apareceram dois defeitos que não eram
dela. Os dois estão corrigidos.

### 1. A máscara do reveal decepava acentos

`.reveal-line` tem `overflow: hidden` e a caixa de linha é `line-height: 0,86`.
As métricas da Archivo são ascent 0,88em e descent 0,21em, então a caixa fica
**0,115em menor que o glifo em cima** — e cortava til e agudo fora.

A manchete da Home lia **"NAO PERDE TALENTO"**. Em produção, na primeira dobra.
O respiro de baixo (`0.1em`, para a perna do "Q") já existia e batia com os
0,095em que o descent pede — a conta do autor estava certa, só faltava o topo.
Agora `.reveal-line` tem `padding-top: 0.13em` com a margem negativa de volta,
então o ritmo não mudou. Estender a máscara para cima não vaza a animação: as
letras entram por baixo, nunca por cima.

### 2. Todos os H1 estavam vazios para leitor de tela

`RevealText` quebra a frase em letras e marca o conjunto `aria-hidden` — senão a
leitura sai soletrada. O comentário do componente sempre disse que quem carrega
o texto é o `aria-label` do título. **Nenhuma das três rotas o tinha.** O axe
acusava `empty-heading` na Home, e o H1 entregava string vazia.

As três rotas e a 404 agora põem `aria-label={…headline.join(' ')}`. O requisito
está escrito em caixa alta dentro do `RevealText.tsx`, para não se perder de
novo.

**Verificado com axe-core 4.10 (o mesmo motor da categoria do Lighthouse), nas
quatro rotas: zero violações.** Os dois `color-contrast` "incompletos" da 404 são
o SVG de textura impedindo o axe de ler o fundo; os pares reais são 7,60:1
(`base/70` sobre ink) e 7,21:1 (mostarda sobre ink), medidos à mão.

> O Lighthouse **não audita a 404**: ela responde HTTP 404 e ele aborta com
> `ERRORED_DOCUMENT_REQUEST`. Para essa rota, use axe direto na página.

### Como a 404 é feita

Duas seções: **bloco escuro** com a manchete (o recado é "você saiu do
caminho", e é a única página que abre no escuro), e **lista das três rotas**
sobre o creme, cada linha com numeral, nome em display e uma descrição tirada da
própria página de destino.

Três decisões que têm motivo:

- **Nenhum bloco de mostarda.** A mostarda cheia é o ponto alto da Home e a
  única vez que ela ocupa a tela — repetir aqui gastaria o efeito. Na 404 ela
  aparece só como filete de hover, último ponto da rampa e o rótulo `ERRO 404`
  sobre o escuro. Mostarda sobre creme dá **1,95:1** e não pode virar texto.
- **A lista fica fora do bloco escuro.** O bloco abre com `clip-path` do GSAP
  (`data-dark`), e o HANDOFF já registra que um reveal desses fica preso se o
  JavaScript quebrar depois do GSAP montar. No site inteiro é risco aceito;
  nesta página não seria, porque é justamente ela que precisa funcionar quando
  algo já deu errado. A saída mora na seção de baixo, que nada esconde.
- **O nome da rota cresce por breakpoint** (32 → 48 → 72px). Medido:
  "SERVIÇOS" a `wdth` 86 pede 4,619px de largura por 1px de corpo, e a coluna de
  4 só comporta os 333px do corpo 72 a partir de 1280px.

### Um número que estava errado na documentação

A tabela de divisores dizia que `.d-hero` usava 15,1. **O código sempre usou
10,8** — o 15,1 é de quando a manchete tinha quatro linhas, antes de virar
cinco. O código estava certo, a nota é que envelheceu. Remedido e corrigido aqui
e no comentário do `globals.css`.

---

## A virada desta sessão

O Benjamin reprovou a primeira versão com **"pq esta tao basico"**, e estava
certo. O diagnóstico que dei a ele:

1. **O site não tem uma única imagem.** Varri o `EngageMend.mp4` inteiro: são 27
   segundos de tipografia animada e prints do painel. Não existe foto de jovem,
   de maratona, nem da cidade. Ele confirmou: **não há foto nenhuma ainda.**
2. Toda seção tinha a mesma forma — título à esquerda, texto embaixo, seis vezes.
3. `ink` ocupava ~15% da tela, contra os 30% que o próprio briefing pede.
4. A mostarda tinha virado filete de 2px em vez de bloco.

Ele então mandou copiar o sistema visual de **prismatic-mandazi-9c3684.netlify.app**
— o site do Tsen Chung Kang, mesma Pompeia e mesma Fatec Shunji Nishimura que
aparecem no briefing, material da casa.

### O que veio de lá, e o que não veio

**Veio a direção:** tipografia de display em caixa alta e escala enorme, fontes
abertas do Google, rótulos em monoespaçada numerados, textura de curvas de nível
ao fundo, faixa rolante de palavras, painéis escuros com cartões, um bloco
inteiro na cor de destaque.

**Não veio nada de lá dentro.** Nenhum trecho de markup, CSS, texto ou imagem do
site de referência foi copiado. A textura de curvas é um SVG que eu gerei em
Python (`public/texture.svg`, e a variante clara para os blocos escuros). O
laranja dele **não entrou** — a EngageMend fica nas três cores do briefing, com
a logo dela. Copiar o laranja faria a EngageMend parecer outra marca, e isso
contraria a regra de não mexer na marca do cliente.

### Sistema tipográfico novo

| Papel | Fonte | Onde |
|---|---|---|
| Display | **Archivo** variável (eixo `wdth`) | H1, H2, numerais, formatos |
| Corpo | **IBM Plex Sans** 400/500/600 | parágrafo, lista, botão |
| Rótulo | **IBM Plex Mono** 400/500 | `01 — …`, campos, numerais |

Substitui Plus Jakarta Sans + Inter, que o briefing pedia. **Desvio consciente,
a pedido dele.**

O truque que faz o sistema funcionar é o **eixo de largura do Archivo**. Cada
tamanho de display está amarrado à linha mais longa que ele precisa conter,
medido no navegador com a fonte real:

| Classe | `wdth` | Fórmula | Linha que a amarra |
|---|---|---|---|
| `.d-hero` | 72 | `(100vw − 112px) / 10,8` | "por falta de gente boa." |
| `.d-giant` | 72 | `(100vw − 112px) / 11,9` | "Sua cidade tem um evento" |
| `.d-quote` | 72 | `(100vw − 112px) / 25,6` | "Segura fazendo o jovem criar algo antes de ir embora." |
| `.d-section` | 86 | `clamp(30px, 5vw, 72px)` | "precisam sair de suas cidades pequenas" |
| `.d-notfound` | 72 | `(100vw − 112px) / 5,6` | "Esta página" (manchete da 404) |

**Ao mexer em qualquer texto de display, remeça.** A 86 de largura a manchete
pedia 1873px e quebrava em cinco linhas; a 72 ela cabe nas quatro quebras que o
briefing fixou, a 88px. Os divisores acima não são chute, são medida.

### Ritmo da Home

hero (textura) → faixa rolante → problema → etapas com pin → **FAZEMOS
ACONTECER** no tamanho gigante → vídeo → citação (bloco escuro) → **bloco
inteiro de mostarda** com o contato → rodapé escuro.

O bloco de mostarda é o ponto alto e a única vez que a cor de destaque ocupa a
tela toda. Texto ali é `ink` **cheio** — `ink/70` sobre mostarda dá 3,87:1 e
reprova. É regra da seção 4 do briefing, e eu já a quebrei uma vez nesta sessão.

---

## Pendências com ele

1. **Não existe foto.** Enquanto não existir, o site continua sendo tipografia
   sobre cor. É a última coisa que separa este site de um site excelente — e
   nenhuma tipografia resolve sozinha. Uma sessão de fotos numa maratona real
   muda mais do que qualquer ajuste de código.
2. **Domínio de produção.** `NEXT_PUBLIC_SITE_URL` continua caindo em
   `localhost`; sem ele as URLs de Open Graph e o `sitemap.xml` saem errados no
   Netlify. Uma variável de ambiente.
3. **Favicon.** Gerado por recorte da rampa de pontos do arquivo original
   (pixels originais, x 840–1178, sem redesenho) sobre um quadrado `ink`.
   Confirmar com ele, e trocar se a EngageMend já tiver um ícone.
4. ~~**Página 404.**~~ **Feita** (quinta passada). Continua sendo o único texto
   do site que não veio do briefing, e continua isolado em `notFound` no
   `lib/content.ts` — se ele quiser reescrever, é lá e em lugar nenhum mais.
5. **Rótulos de seção.** `01 — Cidades de até 50 mil habitantes` e companhia
   saem de `labels` no `content.ts`. São expressões que já existem no texto ou
   nas keywords dele; a única invenção é "role para descer", que é instrução de
   uso.

---

## Desvios do briefing, todos deliberados

- **Fontes trocadas** (acima) e **escala de display fora da tabela da seção 5**.
  A pedido dele, para o site deixar de ser tímido.
- **Contraste ganha dos efeitos.** O briefing exige Acessibilidade 100 e pede
  dois efeitos que reprovam. `ink/20` no parágrafo que se preenche dá 1,49:1 —
  ilegível. Virou `ink/70` → `ink`. O numeral das etapas foi de `ink/25` para
  `ink/55`. A seção 4 dele chama as regras de contraste de inquebráveis.
- **Efeito 6 implementado de outro jeito.** "O fundo da página vai de `base` a
  `ink`" não tem superfície visível aqui: toda seção pinta o próprio fundo. No
  lugar, o bloco escuro entra com um `clip-path` descendo de cima, e
  `data-zone="dark"` no `<html>` inverte a régua da esquerda.
- **CTA em pílula no header**, que o briefing proíbe — o site de referência tem,
  e é a rota mais curta até a conversa. **Some abaixo de 768px**: ali não cabe ao
  lado da marca e dos dois links, e vale o header do briefing.
- **Header sticky**, **seta dos CTAs em SVG**, **18px/44px/2px na escala**,
  **`brightness-94`** para o "escurece 6%" bater exato.

---

## Como o site está montado

```
app/
  layout.tsx       fontes, metadata, JSON-LD, Header/Footer, camada de scroll
  page.tsx         sobre/page.tsx   servicos/page.tsx
  not-found.tsx    a 404: bloco escuro + lista das três rotas
  globals.css      tokens, escala de display, textura, régua, linha do tempo
  sitemap.ts  robots.ts  icon.png  apple-icon.png  favicon.ico
components/
  brand/Logo.tsx            o arquivo original, só sobre ink
  layout/Header.tsx Footer.tsx
  motion/SmoothScroll.tsx   Lenis + GSAP no mesmo relógio
  motion/Motion.tsx         TODOS os efeitos de scroll, em um lugar só
  motion/ContourField.tsx   campo de curvas em WebGL (shader próprio) [4ª passada]
  motion/Cursor.tsx         cursor com mix-blend-mode: difference   [4ª passada]
  motion/Preloader.tsx RouteCurtain.tsx
  ui/Button.tsx Arrow.tsx Marquee.tsx RevealText.tsx FillText.tsx
  ui/Ramp.tsx               a rampa de pontos, motivo gráfico       [4ª passada]
  ui/Counter.tsx ScrollProgress.tsx
  sections/home|sobre|servicos/...
lib/
  content.ts   TODO o texto, mais `labels` e `marquee`
  animations.ts seo.ts lenis.ts ready.ts useIsomorphicLayoutEffect.ts
public/
  logo.png  EngageMend.mp4  video-poster.jpg  texture.svg  texture-light.svg
```

**A regra que sustenta tudo:** as seções são componentes de servidor e os
ganchos de animação são atributos `data-`. `Motion.tsx` procura por eles. Nada é
escondido por CSS — quem esconde é o GSAP, em tempo de execução. Por isso o site
inteiro continua legível com o JavaScript desligado.

O texto fica em caixa normal no `content.ts`; **quem sobe para maiúscula é o
CSS**. A copy segue revisável do jeito que ele escreveu e o leitor de tela não
soletra palavra.

### Orçamento de `scrub` (limite do briefing: 2 por rota)

- `/` → preenchimento do parágrafo + pin das etapas
- `/servicos` → trilho da linha do tempo
- `/sobre` → nenhum

A régua da esquerda lê o scroll num rAF próprio, sem criar ScrollTrigger.

---

## Riscos conhecidos

- **Reveal preso.** Bloco escuro e vídeo começam com `clip-path` aplicado pelo
  GSAP e só abrem quando o ScrollTrigger dispara. Se o JavaScript quebrar depois
  de o GSAP montar, essas seções ficam escondidas.
- **Três famílias de fonte custam performance.** A Home saiu de 97 para 91. Ainda
  acima da meta, mas a folga encolheu: pense antes de adicionar peso.
- **`sharp` não instalado.** O build avisa; no Netlify o runtime do Next resolve
  a otimização de imagem.

---

## Como rodar

```powershell
cd "C:\Users\KABUM\Desktop\site_engagemend_bunito"
npm run build
npm run start -- -p 3320
```

O servidor da porta 3320 ficou **rodando** ao fim desta sessão.
