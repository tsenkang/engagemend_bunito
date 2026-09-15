# HANDOFF — Site EngageMend (pasta `site_engagemend_bunito`)

Última sessão: 2026-09-14 (décima passada — a maratona de criação virou baralho).
**Leia este arquivo inteiro antes de tocar em qualquer coisa.**

O briefing original do Benjamin está em `_build/BRIEFING.md`, verbatim,
recuperado da transcrição. Ele continua sendo a fonte da verdade sobre
**conteúdo**. Sobre **visual**, ele foi substituído — ver abaixo.

---

## Onde está

As 5 fases construídas, build de produção limpo, três rotas estáticas.

**Lighthouse mobile, remedido em 2026-09-14** (Lighthouse 12.8.2, headless,
mediana de 5 execuções na Home e de 3 nas outras):

| Rota | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| `/` | **89** (89–89) | 100 | 100 | 100 |
| `/servicos` | 92 (92) | 100 | 100 | 100 |
| `/sobre` | 93 (93–94) | 100 | 100 | 100 |

Meta do briefing: Performance ≥ 90, Acessibilidade 100, SEO 100. As duas rotas
de dentro batem; **a Home está um ponto abaixo**, e o que a tirou de lá foi peso
de HTML pedido depois: um ponto da costura de pixels (sétima passada) e um do
atalho das etapas (oitava). As linhas da Home e de `/servicos` são da décima
passada; a de `/sobre` é da sexta, e aquela rota não mudou desde então. Sem scroll horizontal de 320px a 1440px nas três rotas.
CLS 0,001 na Home e em `/servicos`, 0 em `/sobre`.

> **A dispersão da Home era de 6 pontos** entre execuções na mesma máquina e no
> mesmo build — numa sessão a primeira medição deu 82 e a quarta, 93. **Era o
> pin**, que saiu na décima passada: depois dele as cinco execuções deram 89
> cravado. A regra continua de pé — mediana de 5, nunca logo depois de um
> `npm run build` —, porque quem garante que a dispersão não voltou é medir.

A tabela anterior dizia 91 / 94 / 93, era da terceira passada e de uma execução
por rota. Antes do corte desta passada, a remedição dava **89 / 91 / 92** — a
Home abaixo da meta. O que mudou está na seção seguinte.

---

## A sexta passada: o que custa os pontos da Home

O HANDOFF anterior mandava remedir e suspeitava do shader. A suspeita se
confirmou — mas o motivo não é o que ele supunha, e a diferença importa para
quem for mexer.

| Build | Amostras | Mediana |
|---|---|---|
| como está | 87 / 88 / 89 / 90 / 93 | **89** |
| sem o `ContourField` | 90 / 92 / 92 | **92** |
| sem movimento nenhum (`--force-prefers-reduced-motion`) | 93 / 98 | **~95** |

O campo de curvas custa ~3 pontos. A camada de movimento inteira — shader,
GSAP, preloader e cursor — custa ~6. O que ela come é **TBT e Speed Index**:
sem movimento o TBT cai de ~200ms para 20ms e o Speed Index de 2,6s para 1,8s.

**O LCP não é da camada de movimento.** Ele fica em ~3,0s nas três rotas, e
com todo o movimento desligado fica em 3,0s do mesmo jeito. É quase tudo
*render delay* no modelo do Lighthouse, não espera de rede: TTFB de ~460ms e o
resto é a simulação do caminho crítico. Não adianta procurar culpado no GSAP.

### Duas tentativas que falharam — não repetir

1. **Subir o shader só depois do evento `load`**, em vez do
   `requestIdleCallback` com timeout de 2s. Medido: 86 / 88 / 89 / 90 / 93 —
   mediana 89, idêntico. A janela de TBT do Lighthouse vai até o TTI, que é
   **depois** do `load`: não existe "mais tarde" para onde empurrar o custo.
2. **Cortar o shader para 30 quadros por segundo**, com o passo do ponteiro
   dobrado (0,06 → 0,12) para o movimento não ficar mais lento. Medido:
   88 / 88 / 89 / 90 / 92 — mediana 89, idêntico.

As duas foram revertidas: mudança que não move o número é complexidade de
graça. E juntas elas eliminam as hipóteses fáceis — **o custo não é quando o
shader sobe, nem quantos quadros ele desenha.** Sobra o custo fixo de criar o
contexto WebGL e compilar o shader, mais uma camada de composição do tamanho da
tela que fica no ar a visita inteira. Nada disso se agenda para outro momento.

### O que o Benjamin decidiu (2026-09-14)

**O campo de curvas fica no desktop e não sobe no celular.** Ele escolheu entre
as três saídas medidas, e escolheu esta.

Uma linha no `ContourField`, a mesma consulta que o `Cursor` já usava:
`(hover: hover) and (pointer: fine)`. O raciocínio está escrito no componente —
metade do efeito (o relevo afundando sob o ponteiro) não existe no toque de
qualquer jeito, e um shader em laço contínuo é bateria de quem está no celular.

Resultado medido depois do corte:

| Rota | Antes | Depois |
|---|---|---|
| `/` | 89 (87–93) | **90** (90–93) |
| `/servicos` | 91 | **92** (92–94) |
| `/sobre` | 92 | **93** (93–94) |

O TBT da Home caiu de ~200ms para ~120ms. O que mais importa não é a mediana e
sim o piso: **nenhuma das cinco execuções ficou abaixo de 90**, contra três de
cinco antes.

**No desktop nada mudou**, e isso foi conferido, não suposto: auditoria desktop
dá Performance **99** e a captura do próprio Lighthouse mostra as curvas de
nível no fundo, com o ponto do cursor no lugar.

### Uma mudança que ficou

O vídeo da Home passou de `preload="metadata"` para **`preload="none"`**. O
Chrome puxava 68 kB do arquivo durante o carregamento, numa seção abaixo da
dobra que a maioria nunca abre. **Não moveu a nota** — mas são 68 kB do plano
de dados de quem entra pelo celular, e o pôster não depende do `preload`:
continua desenhando o quadro e segurando a altura 16/9.

---

## A sétima passada: a costura de pixels e a manchete

Duas coisas pedidas pelo Benjamin depois da remedição.

### 1. Costura de pixels entre seções

Trazida do site anterior (`Desktop\site da engagemend (do zip)`, componente
`PixelDissolve`) — **é o único efeito de transição que existe lá**; transição de
rota não há nenhuma, em nenhuma das três versões antigas.

Uma grade de 14×4 blocos na cor da seção **de cima** cobre o topo da de baixo e
derrete quadrado a quadrado, em ordem aleatória, enquanto o scroll cruza a
fronteira. Portada a **direção**, não o arquivo: lá o componente tinha o próprio
`useLayoutEffect` e o próprio ScrollTrigger; aqui a grade é componente de
servidor com `data-dissolve` e quem anima é o `Motion`, como todo o resto.

Sete costuras, sempre onde a cor muda de verdade: 4 na Home, 2 em `/servicos`,
1 em `/sobre`. Onde entra costura, o `clip-path` que revelava aquele bloco é
pulado — os dois fazem o mesmo trabalho e juntos brigam. A checagem está no
`darkZones` e no `accentWipe`.

**Sem JavaScript e com movimento reduzido a grade some por CSS** (o `<noscript>`
do layout e a regra no `globals.css`). Sem isso ela ficaria cobrindo o topo de
cada bloco para sempre, porque quem a tira é o GSAP.

> **O pin da Home estava adiantando tudo que vem depois dele.** Das quatro
> costuras da Home, só a primeira derretia na tela: as outras três derretiam
> inteiras abaixo da dobra, medido a 930–1450px do alto de uma janela de 900.
> Em `/sobre` e `/servicos`, sem pin, as mesmas costuras sempre funcionaram.
> O pin estica o documento com um espaçador e quem for medido antes disso mede
> numa página que ainda não cresceu. `refreshPriority: 1` no pin resolveu.
> **Vale para qualquer gatilho novo abaixo do pin**, não só para a costura.

Custo medido: a Home caiu de 90 para **89**; `/servicos` e `/sobre` não se
mexeram. O que pesa não é o scroll (o TBT até melhorou, 120 → 90ms) e sim o
tamanho da página — 4 costuras × 56 blocos são 224 nós, e a Home foi de 354 para
582 elementos. Se for preciso recuperar o ponto, as saídas em ordem de menor
dano: menos blocos por costura (12×3 tira 80 nós), ou tirar a costura do vídeo,
que é a que menos acrescenta.

### 2. A manchete da Home

Ele disse que não estava confortável de ler nem de ver. Estava certo, e o que
havia era pior do que parecia.

**O divisor da `.d-hero` era impossível.** Medido por busca binária dentro do
próprio H1 — subindo o corpo até a linha estourar, igual a 1440, 1024 e 390px —
a linha mais longa ("por falta de gente boa.") pede **12,86px de largura por
1px de corpo**. O CSS usava **10,8**, que pediria 1,19 da coluna: a linha
quebrava em *toda* largura, de 320 a 1728px, e a Home lia
**"POR FALTA DE GENTE" / "BOA."**, com a palavra órfã embaixo. O 10,8 era de uma
medição antiga que nunca foi refeita quando a manchete passou de quatro linhas
(as do briefing) para cinco.

O que mudou:

| | Antes | Depois |
|---|---|---|
| Divisor de largura | 10,8 (pedia 1,19 da coluna) | **13,7** (enche 0,94) |
| Limite por altura | não havia | **`(100svh − 400px) / 4,5`** |
| Entrelinha | 0,86 | **0,9** |
| Corpo a 1440×900 | 123px | **96,9px** |
| Altura da manchete | 73–92% da tela | **42–64%** |
| Quebras indevidas | em toda largura | **nenhuma de 360 a 1920px** |

**São dois limites e vale o menor.** Uma manchete de cinco linhas não se resolve
só pela largura: numa tela baixa ela enche a dobra sozinha e empurra a chamada e
o botão para fora — era o que acontecia a 1440×900. Agora a chamada e o botão
cabem na primeira tela em tudo, de 390px a 1920px.

Três achados que saíram deste conserto e valem além dele:

- **O `RevealText` partia palavra no meio.** Cada letra é um `inline-block`, e
  inline-block é ponto de quebra: num celular de 390px a Home lia
  **"POR FALTA D" / "E GENTE BOA."**. As letras agora vão agrupadas em
  `.reveal-word`, que é `nowrap`. O defeito era antigo e só não aparecia porque
  a linha, quebrando sempre, calhava de partir num espaço.
- **A goteira virou variável** (`--gutter` no `.shell-wide`). As fórmulas de
  display descontavam 112px fixos — a margem do desktop — e no celular sobrava
  largura que o cálculo não via. Era o que obrigava cada tamanho a ter um piso
  chutado para cima. `.d-hero` já usa a variável; **`.d-section`, `.d-giant`,
  `.d-quote` e `.d-notfound` ainda usam os 112px fixos** e podem ser passados
  para ela quando alguém mexer neles.
- **O piso de 32px no celular vai contra a fórmula, de propósito.** Pela largura
  um celular de 390px pediria 25px — e a 25px a manchete empata com os 18px do
  texto corrido: deixa de ser manchete. 23 caracteres em caixa alta não cabem
  grandes em 342px de coluna, então a linha mais longa se reparte em duas com
  `text-wrap: balance`, num limite de palavra. Abaixo de 360px o piso cai para
  24px.

Conferido depois: animação de entrada intacta (74 de 74 letras animam e
assentam), acessibilidade 100 nas quatro rotas, CLS 0,001, e as quatro rotas
respondendo — o `RevealText` é usado em todas.

---

## A oitava passada: a maratona de criação virou conduzível

> **Substituída pela décima passada.** O trilho horizontal não existe mais: a
> seção virou um baralho de cartões. O que segue fica porque três das decisões
> sobreviveram inteiras — o atalho das quatro etapas, o `aria-current="step"` e
> a regra de nunca apagar texto para marcar estado — e porque os defeitos aqui
> descritos explicam por que elas são assim.

Ele pediu a seção "muito mais interativa do que apenas rolar para os lados".
Ela agora tem **três formas de conduzir, e uma fonte de verdade só**.

- **Clicar numa etapa** no atalho novo (`01 Entender · 02 Preparar · 03 Fazer ·
  04 Entregar e medir`). São âncoras de verdade: sem JavaScript pulam para o
  cartão; com JavaScript o `Motion` leva o trilho até lá.
- **Arrastar o trilho** com o ponteiro, **1:1 com a mão** — 480px de arrasto são
  480px de trilho. Só com mouse: no dedo o scroll nativo já faz isso, e
  sequestrar o toque tiraria do visitante o gesto que ele conhece.
- **Rolar a página**, como antes.

Os três mexem na **mesma** coisa, porque a posição do trilho continua sendo o
scroll — não há estado paralelo para dessincronizar. O atalho marca a etapa com
`aria-current="step"` (não `tab`: os quatro cartões ficam visíveis ao mesmo
tempo, então a semântica de aba seria mentira para quem ouve), o cartão ativo
ganha a borda de mostarda e uma barra mostra quanto do método já passou.

**O inativo continua em `base/70`.** A diferença entre ativo e inativo é o
numeral em mostarda e o filete embaixo, nunca texto mais apagado — apagar texto
para marcar estado é a forma mais comum de reprovar contraste.

### Quatro defeitos que apareceram no caminho

1. **As etapas 03 e 04 eram inalcançáveis.** Cabem quase três cartões de uma
   vez, então o trilho acabava antes de o terceiro chegar à esquerda: clicar em
   "Fazer" parava em "Preparar" e o marcador mentia. Duas causas somadas —
   faltava sobra no fim do trilho (agora um `::after`, não um `<li>`, porque a
   lista é das quatro etapas) e o percurso era lido do `scrollWidth`, que o
   Chrome não conta quando o elemento é `overflow: visible`. O percurso agora é
   **a distância até a última etapa encostar na esquerda**, medida pela posição
   dos cartões.
2. **A composição presa não cabia na tela.** O atalho somou ~100px e o cartão
   passava a ser cortado: 100px a 900 de altura, 200px a 800 — e 800 é a altura
   do notebook comum. Parte disso já acontecia antes. Todo o respiro vertical do
   palco agora é medido em `svh`, e o miolo do cartão também: numa tela de 1080
   ele abre, numa de 768 ele fecha. Sobram 89–219px em todas as alturas testadas.
3. **O rótulo da seção sumia atrás do cabeçalho.** O pin era `top top`, colado no
   alto da janela, e o cabeçalho fixo de 72px cobria o "02 — Maratona de criação"
   durante a seção inteira. Agora o pin é `top 72px`.
4. **Sem JavaScript, as etapas 03 e 04 não existiam acima de 1024px.** O trilho
   transbordava por CSS a partir daquela largura, incondicional, e o
   `overflow-hidden` da seção comia os dois últimos cartões sem jeito de chegar
   neles. Defeito antigo; o atalho só o deixou visível, porque passou a prometer
   links que não levavam a lugar nenhum. Agora quem marca `data-pinned` é o GSAP,
   então sem JavaScript o trilho continua sendo uma lista que rola de lado.

Custo: a Home foi de 89 para **88** (DOM de 582 para 607). Acessibilidade 100,
nenhuma auditoria reprovada, CLS 0,001.

Conferido: clique nas quatro etapas, arrasto, teclado (foco e Enter), o mesmo no
celular (o atalho rola o trilho em vez da página), e o modo sem JavaScript.

---

## A nona passada: o "arrow reveal" no botão de agendar

Ele mandou o componente **Arrow Reveal do Originkit** e pediu o efeito no botão
de agendar. Como na costura de pixels, foi portada a **direção**, não o arquivo.

O original é Framer Motion (`motion/react`, que não está no projeto): um
`useAnimate` e um `ResizeObserver` que mede o botão a cada mudança de tamanho
para descobrir de quanto escalar o disco até ele cobrir o retângulo. Trazer isso
significava uma biblioteca de animação inteira e um componente de cliente numa
Home que já está abaixo da meta — e o efeito não precisa de nenhum dos dois.

**Como ficou:** `components/ui/ArrowRevealButton.tsx`, componente de servidor,
sem um byte de JavaScript. A mecânica é `.cta-reveal` no `globals.css`:

- O **disco é a própria camada que inunda**. Ele é um `<span>` em `inset: 0`
  recortado por `clip-path: circle()` — em repouso o raio é 16px, no hover é
  150%. Não são dois elementos da mesma cor fingindo ser um só, então não existe
  emenda para desalinhar.
- **150% cobre qualquer largura, e é por isso que não se mede nada.** Em
  `circle()` a porcentagem resolve contra `√(w² + h²) / √2` do próprio botão.
  Com o disco encostado na borda, o canto mais distante do centro dele tende a
  `w`, e a referência tende a `0,707 w`: a razão nunca passa de 142%, por mais
  largo que o botão fique. Conferido interpolando na mão — no meio do caminho o
  valor computado é `circle(calc(75% + 8px) …)`, um mistura de px e %, não um
  salto.
- **A seta anda mudando `left`** de px para 50%. É layout, não composição, mas
  são 20px dentro de um botão de 222 e só acontece sob o ponteiro. A alternativa
  (translate em porcentagem) precisaria da largura do botão, que é exatamente o
  que não se sabe sem medir.
- **O rótulo desliza 8px** enquanto some debaixo do creme, como no original. Ele
  continua no DOM inteiro e sem `aria-hidden`: quem ouve a página ouve "Agendar
  conversa", coberto ou não. Quem tem `aria-hidden` é a seta.
- **Curva e duração são as do efeito** — `cubic-bezier(0.44, 0, 0.56, 1)`,
  460ms —, e não a do resto do site. A curva de cá (0.16, 1, 0.3, 1) dispara
  quase toda no primeiro terço: num disco que atravessa 220px isso lê como
  estouro, não como maré.
- **Sem movimento não há inundação.** Com `prefers-reduced-motion: reduce` o
  bloco do hover inteiro não se aplica — sobra o botão clareando (`ink/0.88`,
  11:1 com o rótulo creme). Um botão que troca de cor inteiro de um quadro para
  o outro é susto, não resposta.

Tamanho e folga do disco saem de `--disc` (32px) e `--disc-inset` (6px), no topo
da regra. Os dois somados com o padding de 6px é que dão os 44px de alvo de
toque: mexer em um pede conferir o outro.

### O contraste que o efeito importado não previa

Com o creme inundando, a peça no hover é **creme sobre mostarda: 2,2:1 de
contorno**, abaixo dos 3:1 que a 1.4.11 pede para a peça continuar reconhecível
como botão. Não é coisa que o axe ou o Lighthouse reprovem — nenhum dos dois
audita contraste não textual —, mas a seção 4 do briefing chama essas regras de
inquebráveis.

Resolvido com um **filete de 2px em `ink`**: invisível em repouso (escuro sobre
escuro) e presente quando o creme chega, onde dá 6,4:1 contra a mostarda. Os 2px
saem do padding (6 e 14 no lugar de 8 e 16), senão o botão cresceria 4px e sairia
de linha com o resto do fecho. Altura medida no navegador: 45px antes e depois.

### Dois botões, um componente

`home/Contact.tsx` e `servicos/Closing.tsx` tinham a **mesma marcação duplicada**
— as mesmas 300 e poucas letras de classe em dois arquivos. Agora os dois chamam
`ArrowRevealButton`. O botão da Hero ("Falar conosco") **não** mudou: é o
`Button` de mostarda, que é outra peça e outra cor.

### O que a mudança custou

Medido depois, no mesmo protocolo (mediana de 5 na Home, de 3 em `/servicos`):

| Rota | Performance | Amostras | Acessibilidade |
|---|---|---|---|
| `/` | **89** | 89 / 89 / 89 / 91 / 91 | 100 |
| `/servicos` | **92** | 92 / 92 / 92 | 100 |

A Home estava em 88 (87–89) antes desta passada, no mesmo build. Um ponto de
diferença com esta dispersão **não é melhora provada** — o que dá para afirmar é
que o efeito não custou nada: o DOM subiu de 607 para 610 (os três `<span>` do
botão) e o HTML de cada botão **encolheu ~115 bytes**, porque as trinta classes
de Tailwind viraram uma. O CSS cresceu ~0,7 kB cru. `/sobre` não foi remedida:
não tem botão de agendar, e o que mudou nela é só esse CSS.

---

## A décima passada: a maratona virou baralho

Ele mandou o **Skiper 48 / Carousel_002** (React + Swiper, efeito `cards`) e
pediu a seção assim: arrastar o texto em formato de cartão. O trilho horizontal
da oitava passada saiu inteiro.

Portada a **direção**, não o arquivo — a terceira vez neste projeto. O original
traz Swiper mais `framer-motion`: cerca de 45 kB de JavaScript para quatro
cartões de texto, numa Home que já está abaixo da meta. O que o efeito é, no
fim, são quatro `transform` e um arrasto, e a camada de movimento do site já
existe.

### Como o baralho é feito

- **Os quatro cartões dividem uma célula de grade só** (`grid-area: 1 / 1`).
  É isso que empilha sem tirar nada do fluxo: a altura da célula continua sendo
  a do cartão mais alto, então a pilha não desaba e ninguém precisa medir
  altura em JavaScript para escrevê-la de volta — que é o que o Swiper faz.
- **O `Motion` escreve um `transform` por cartão e o CSS interpola.** Camada 0
  é a frente; as de trás recuam 30px, encolhem 5% e giram 3° cada. Da terceira
  para trás o cartão para de recuar e fica invisível no lugar da terceira.
- **Dois jeitos de conduzir, um índice só:** arrastar o cartão da frente
  (ponteiro e dedo) ou clicar numa etapa no atalho, que continua sendo o mesmo
  de antes — âncoras de verdade, com `aria-current="step"` e o caminho do
  teclado. Não há estado paralelo para dessincronizar.
- **Vira a etapa quem passa de 26% da largura do cartão.** Abaixo disso o
  cartão volta. Nas pontas o arrasto passa a 28% (elástico), porque travar seco
  faz a mão parecer que perdeu o cartão.
- `touch-action: pan-y` no baralho: o dedo rola a página para baixo e só o eixo
  horizontal fica reservado para o arrasto.
- **Sem JavaScript, e para quem pede menos movimento, não há baralho:** os
  quatro cartões são uma lista, um debaixo do outro, com o método inteiro
  legível de uma vez. Quem empilha é o `data-on` que o `Motion` põe — e é por
  isso que a instrução "arraste os cartões" também só existe a partir dali.

Do original ficaram de fora, de propósito: `loop` (um método de quatro etapas
não dá a volta — 04 é o fim), as setas e a paginação do Swiper (o atalho das
quatro etapas já é isso, e com texto em vez de bolinhas) e o `autoplay`.

### Três defeitos que apareceram no caminho

1. **Os cartões eram transparentes e dava para ler os quatro de uma vez.** No
   trilho eles ficavam lado a lado e o `base/6` translúcido do `.panel` bastava
   de superfície; empilhados, o texto dos de baixo atravessava o de cima. A
   saída não muda cor nenhuma: a mesma clareada entra como `background-image`
   por cima de um `ink` chapado — mesmo tom, e o cartão tapa o que está atrás.
2. **O `:hover` do `.panel` desfazia isso exatamente na hora em que a mão
   chegava**, porque ele troca o fundo por `base/10` translúcido. O cartão da
   frente é o único que recebe ponteiro, então hover e etapa atual são sempre o
   mesmo cartão: as duas regras agora andam juntas.
3. **Os cartões de trás sumiam inteiros atrás da frente.** Girando pela base o
   encolhimento empurra o topo para baixo quase tanto quanto o recuo o levanta;
   passei a origem para o centro e ainda assim 16px de recuo deixavam 6px de
   aba. Com 30px sobram 20px na primeira camada e 41px na segunda, medidos no
   navegador.

### O que saiu junto

- **O único pin da Home.** Era ele que esticava o documento com um espaçador e
  obrigava a costura de pixels a pedir `refreshPriority` para não disparar
  cedo. A seção agora é um bloco normal de ~576px.
- **Um `scrub` do orçamento:** a Home foi de 6 para 5.
- `stepOffsets` e `stepAt`, o bloco morto `[data-steps][data-stacked]` do CSS
  (que documentava um pin que não existe mais) e as regras do `.track`.
- **A régua da esquerda tinha quatro marcadores, um por etapa, e virou um.**
  Eles faziam sentido enquanto o scroll conduzia o trilho: cada marcador era
  mesmo o ponto em que uma etapa entrava. Com o baralho as quatro acontecem
  paradas no mesmo lugar do documento, e quatro pontos espremidos num palmo de
  régua diriam algo que não é verdade.

### O que isso custou

| Rota | Performance | Amostras | Acessibilidade |
|---|---|---|---|
| `/` | **89** | 89 / 89 / 89 / 89 / 89 | 100 |
| `/servicos` | **92** | 92 / 92 / 92 | 100 |

A mediana não mudou, mas **a dispersão da Home desapareceu**: cinco execuções
idênticas, contra os 6 pontos de variação que este arquivo vinha avisando desde
a sexta passada. Era o pin que produzia aquela variação. O DOM caiu de 611 para
608 e o CSS cresceu 587 bytes crus.

Conferido no navegador: arrasto que vira a etapa, arrasto curto que volta,
elástico nas duas pontas, clique nas quatro etapas do atalho (sem pular a
página e sem sujar a URL), a barra de progresso, o cartão 04 com o título mais
longo, e o modo sem JavaScript — a seção vira uma lista de 1738px e a instrução
de arrastar some.

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

## A virada da quarta passada (o sistema visual novo)

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
reprova. É regra da seção 4 do briefing, e eu já a quebrei uma vez na passada
em que escrevi esta seção.

---

## Pendências com ele

1. ~~**A Home abaixo de 90.**~~ **Resolvida** (sexta passada): o campo de curvas
   saiu do celular e a Home voltou para 90, com piso em 90. Ver a seção da sexta
   passada.
2. **Não existe foto.** Enquanto não existir, o site continua sendo tipografia
   sobre cor. É a última coisa que separa este site de um site excelente — e
   nenhuma tipografia resolve sozinha. Uma sessão de fotos numa maratona real
   muda mais do que qualquer ajuste de código.
3. **Domínio de produção.** `NEXT_PUBLIC_SITE_URL` continua caindo em
   `localhost`; sem ele as URLs de Open Graph e o `sitemap.xml` saem errados no
   Netlify. Uma variável de ambiente.
4. **Favicon.** Gerado por recorte da rampa de pontos do arquivo original
   (pixels originais, x 840–1178, sem redesenho) sobre um quadrado `ink`.
   Confirmar com ele, e trocar se a EngageMend já tiver um ícone.
5. ~~**Página 404.**~~ **Feita** (quinta passada). Continua sendo o único texto
   do site que não veio do briefing, e continua isolado em `notFound` no
   `lib/content.ts` — se ele quiser reescrever, é lá e em lugar nenhum mais.
6. **Rótulos de seção.** `01 — Cidades de até 50 mil habitantes` e companhia
   saem de `labels` no `content.ts`. São expressões que já existem no texto ou
   nas keywords dele; a única invenção é "role para descer", que é instrução de
   uso.

---

## Desvios do briefing, todos deliberados

- **Fontes trocadas** (acima) e **escala de display fora da tabela da seção 5**.
  A pedido dele, para o site deixar de ser tímido.
- **A manchete da Home tem cinco linhas, o briefing pede quatro.** A primeira
  linha dele ("Cidade pequena não perde talento") foi partida em duas. Vale a
  pena e está medido: com as quatro do briefing a linha mais longa pede 18,9px
  por px de corpo e a manchete cairia para 66px a 1440; com cinco, a mais longa
  pede 12,86 e ela fica em 97px. As cinco linhas são o que deixa a manchete
  grande. As palavras e a pontuação são as do briefing, intactas.
- **Costura de pixels entre seções**, que o briefing não pede. Veio do site
  anterior, a pedido dele — ver a sétima passada.
- **Orçamento de `scrub` estourado.** O briefing limita a 2 por rota; com a
  costura a Home tem 5 (eram 6 até o trilho horizontal sair) e `/servicos` 3. Pedido depois, sabendo disso. O que
  segura a conta é o ScrollTrigger só trabalhar enquanto a costura está na faixa
  dele — por mais que sejam seis, uma ou duas rodam por vez.
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
  ui/ArrowRevealButton.tsx  o CTA de agendar: disco + inundação    [9ª passada]
  ui/PixelDissolve.tsx      a costura de pixels entre seções       [7ª passada]
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
- **A Home está em 89, um ponto abaixo da meta.** Três famílias de fonte
  levaram-na de 97 para ~91, o WebGL para 89 (resolvido tirando-o do celular) e
  a costura de pixels de volta para 89. Não existe margem nenhuma: qualquer peso
  novo na Home sai do vermelho direto. Remeça sempre com mediana de 5 antes de
  dizer que passou.
- **Qualquer gatilho de scroll novo na Home abaixo da seção do método nasce
  torto** se o pin não for remedido antes dele. Ver a sétima passada: é o que o
  `refreshPriority: 1` no pin conserta, e ele precisa continuar lá.
- **`sharp` não instalado.** O build avisa; no Netlify o runtime do Next resolve
  a otimização de imagem.

---

## Como rodar

```powershell
cd "C:\Users\KABUM\Desktop\site_engagemend_bunito"
npm run build
npm run start -- -p 3320
```

O servidor da porta 3320 ficou **rodando** ao fim da sexta passada.

---

## Como medir

O Lighthouse **não está instalado no projeto** — ele mora no cache do `npx`,
versão 12.8.2, e roda offline de lá:

```bash
LH="$HOME/AppData/Local/npm-cache/_npx/8003d8991b0d346b/node_modules/lighthouse/cli/index.js"
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
node "$LH" http://localhost:3320/ --quiet --output=json --output-path=relatorio.json --chrome-flags="--headless=new --no-sandbox"
```

Mobile é o padrão do CLI, então não precisa de flag. **Sempre `--output-path`
com nome de arquivo:** foi omiti-lo que criou o arquivo chamado `-` na raiz do
projeto na passada anterior.

Três coisas que valem lembrar:

- **Mediana de 5.** Ver o aviso lá em cima — a Home varia 6 pontos entre
  execuções do mesmo build.
- **Nunca medir logo depois do `npm run build`.** A primeira medição desta
  sessão saiu com a máquina ainda ocupada e deu 82, contra 90 das seguintes.
- **A 404 o Lighthouse não audita:** ela responde HTTP 404 e ele aborta com
  `ERRORED_DOCUMENT_REQUEST`. Para aquela rota, axe-core direto na página.

Para separar o custo de cada camada, o truque que funcionou foi
`--chrome-flags="--force-prefers-reduced-motion"`: ele desliga de uma vez o
`ContourField`, o `Cursor`, a animação do preloader e o `Motion` inteiro, porque
todos consultam `prefersReducedMotion()`.
