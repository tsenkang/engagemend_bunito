'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

import { DISSOLVE_COLS, DISSOLVE_ROWS } from '@/components/ui/PixelDissolve';
import { LAYOUT_EVENT } from '@/components/ui/ScrollProgress';
import { DURATION, EASE, STAGGER, prefersReducedMotion } from '@/lib/animations';
import { getLenis } from '@/lib/lenis';
import { ready } from '@/lib/ready';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

/** Deslocamento máximo do ímã do botão, em px. */
const MAGNET = 4;
/** Quanto o botão sobe no hover, em px. */
const LIFT = 2;

/**
 * Toda a camada de scroll do site, em um lugar só.
 *
 * Os ganchos são atributos `data-` no HTML, então as seções continuam
 * sendo componentes de servidor: nenhuma delas precisa virar client
 * component só para ganhar animação, e todas continuam legíveis com o
 * JavaScript desligado — quem esconde qualquer coisa é o GSAP, em tempo
 * de execução, nunca o CSS.
 *
 * Tudo roda dentro de um `gsap.context()` e é revertido na troca de
 * rota. Sem isso o App Router deixa ScrollTrigger órfão apontando para
 * nós que já saíram do documento, e o scroll trava.
 *
 * Orçamento de `scrub` por rota. **O limite do briefing é 2, e a costura
 * de pixels estourou os dois primeiros** — foi pedido depois, sabendo
 * disso:
 * - `/`         → parágrafo + 4 costuras = **5**
 * - `/servicos` → linha do tempo + 2 costuras = **3**
 * - `/sobre`    → 1 costura = **1**
 *
 * O que segura a conta é o ScrollTrigger só rodar o tween enquanto a
 * costura está na faixa dele: por mais que sejam seis, no máximo uma ou
 * duas trabalham ao mesmo tempo. Ver o HANDOFF para o que isso custou de
 * Performance.
 */
export function Motion() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      heroReveal();
      entrances();
      darkZones();
      pixelDissolve();
      videoReveal();
      fillOnScroll();
      timelineTrack();
      counters();
      ramps();
      scramble();
      accentWipe();
    });

    const stopDeck = cardDeck();
    const stopMagnets = magnets();
    const stopAnchors = anchors();
    const stopVelocity = velocity();

    // Os pontos de disparo mudam quando as fontes trocam.
    void document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event(LAYOUT_EVENT));
    });

    return () => {
      context.revert();
      stopDeck();
      stopMagnets();
      stopAnchors();
      stopVelocity();
      delete document.documentElement.dataset.zone;
    };
  }, [pathname]);

  return null;
}

/* ------------------------------------------------------------------ */

/** 2. Reveal com máscara: cada linha do título sobe de dentro da sua. */
function heroReveal() {
  const title = document.querySelector<HTMLElement>('[data-reveal]');
  if (!title) return;

  const characters = title.querySelectorAll<HTMLElement>('[data-reveal-char]');
  if (characters.length === 0) return;

  const timeline = gsap.timeline({ paused: true });

  /**
   * Letra a letra, saindo de baixo da própria linha com uma inclinação
   * leve. O atraso é por posição, não por linha: a onda atravessa a
   * manchete inteira em diagonal.
   */
  timeline.from(characters, {
    yPercent: 118,
    rotate: 4,
    duration: 0.85,
    ease: EASE.enter,
    stagger: { each: 0.012, from: 'start' },
  });

  const below = document.querySelectorAll<HTMLElement>('[data-hero-follow]');
  if (below.length > 0) {
    timeline.from(
      below,
      { opacity: 0, y: 20, duration: DURATION.enter, ease: EASE.enter, stagger: STAGGER },
      '-=0.35',
    );
  }

  // Espera a cortina do preloader sair antes de começar.
  void ready.then(() => timeline.play());
}

/** Entrada genérica, uma vez só, para quem carrega `data-enter`. */
function entrances() {
  ScrollTrigger.batch('[data-enter]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        opacity: 0,
        y: 24,
        duration: DURATION.enter,
        ease: EASE.enter,
        stagger: STAGGER,
        overwrite: true,
        clearProps: 'opacity,transform',
      });
    },
  });
}

/**
 * 6. Os blocos escuros. O painel `ink` desce cobrindo a seção antes de
 * o texto claro aparecer — assim o contraste nunca passa pelo meio do
 * caminho, o que aconteceria se fundo e texto trocassem de cor juntos.
 *
 * Enquanto um bloco desses domina a tela, `data-zone="dark"` no `<html>`
 * inverte a régua da esquerda, que de outro modo sumiria no escuro.
 */
function darkZones() {
  const blocks = gsap.utils.toArray<HTMLElement>('[data-dark]');

  blocks.forEach((block) => {
    /**
     * Onde existe costura de pixels, ela **é** a chegada do bloco: o
     * `clip-path` daqui faria o mesmo trabalho ao mesmo tempo, e os dois
     * juntos leem como dois efeitos brigando pela mesma fronteira.
     * A inversão da régua, logo abaixo, continua valendo nos dois casos —
     * ela não tem nada a ver com como o bloco entra.
     */
    if (!block.querySelector('[data-dissolve]')) {
      gsap.fromTo(
        block,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.7,
          ease: EASE.enter,
          scrollTrigger: { trigger: block, start: 'top 88%', once: true },
          onComplete: () => gsap.set(block, { clearProps: 'clipPath' }),
        },
      );
    }

    ScrollTrigger.create({
      trigger: block,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) document.documentElement.dataset.zone = 'dark';
        else delete document.documentElement.dataset.zone;
      },
    });
  });
}

/**
 * Costura de pixels entre seções. **Não vem do briefing** — vem do site
 * anterior da EngageMend, a pedido do Benjamin (2026-09-14).
 *
 * A grade está no `PixelDissolve`; aqui só se dissolve. Cada bloco sai
 * com `autoAlpha` e `scale` ao mesmo tempo: só o desaparecer deixaria um
 * quadrado fantasma na borda, e só o encolher deixaria um ponto no meio.
 *
 * O escalonamento é `from: 'random'` sobre a grade real — é o que faz a
 * costura parecer corrosão e não uma cortina. Por isso as duas constantes
 * vêm do componente: se a grade mudar e este número não, o GSAP escalona
 * um retângulo que não existe e a ordem vira faixa.
 *
 * `scrub` amarra o derretimento à posição do scroll, e não ao relógio: a
 * costura anda com o dedo, inclusive para trás. É o ponto do efeito.
 */
function pixelDissolve() {
  gsap.utils.toArray<HTMLElement>('[data-dissolve]').forEach((grid) => {
    const tiles = grid.querySelectorAll<HTMLElement>('[data-dissolve-tile]');
    if (tiles.length === 0) return;

    gsap.to(tiles, {
      autoAlpha: 0,
      scale: 0,
      ease: 'none',
      stagger: {
        grid: [DISSOLVE_ROWS, DISSOLVE_COLS],
        from: 'random',
        amount: 0.8,
      },
      scrollTrigger: {
        trigger: grid,
        start: 'top bottom',
        end: 'bottom center',
        scrub: 0.3,
      },
    });
  });
}

/** 10. O vídeo abre de faixa fina para retângulo. */
function videoReveal() {
  const frame = document.querySelector<HTMLElement>('[data-video-frame]');
  if (!frame) return;

  gsap.fromTo(
    frame,
    { clipPath: 'inset(42% 0% 42% 0%)', scale: 1.06 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      duration: 0.9,
      ease: EASE.enter,
      scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
      onComplete: () => gsap.set(frame, { clearProps: 'clipPath,transform' }),
    },
  );
}

/**
 * 4. Primeiro `scrub` da Home: o parágrafo se preenche palavra a palavra.
 *
 * O briefing pede que ele comece em `ink/20`. Medido, `ink/20` dá
 * **1,49:1** sobre o fundo creme — texto ilegível, e reprova a
 * acessibilidade que o mesmo briefing exige em 100. A seção 4 dele
 * chama a regra de contraste de inquebrável, então ela ganha: o
 * preenchimento sai de `ink/70` (5,4:1, o mesmo token de texto
 * secundário do site) e vai até `ink`. Quem cair no meio da página lê
 * o parágrafo inteiro de qualquer jeito.
 */
function fillOnScroll() {
  const group = document.querySelector<HTMLElement>('[data-fill-group]');
  if (!group) return;

  const words = group.querySelectorAll<HTMLElement>('[data-fill-word]');
  if (words.length === 0) return;

  gsap.fromTo(
    words,
    { opacity: 0.7 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.4,
      scrollTrigger: { trigger: group, start: 'top 78%', end: 'bottom 62%', scrub: 0.8 },
    },
  );
}

/**
 * 5. O baralho das etapas.
 *
 * Quatro cartões na mesma célula de grade: o da frente sai na mão, os de
 * trás aparecem recuados, menores e girados. Dois jeitos de conduzir — o
 * arrasto e o atalho das quatro etapas —, e os dois mexem no mesmo
 * `index`, que é a fonte de verdade única. Quem interpola é o CSS: o que
 * este código escreve é um `transform` por cartão.
 *
 * **Não há `scrollTrigger` nenhum aqui.** O trilho horizontal preso à
 * tela saiu, e com ele saiu o único pin da Home — aquele que esticava o
 * documento com um espaçador e obrigava a costura de pixels a pedir
 * `refreshPriority` para não disparar cedo.
 *
 * Sem JavaScript, ou para quem pede menos movimento, nada disto roda: os
 * quatro cartões ficam sendo a lista que o CSS já monta.
 */
/**
 * Estado visível das etapas: qual está sob atenção e quanto do método já
 * passou. Só desenha — não decide nada.
 */
function paintSteps(index: number, progress: number) {
  document.querySelectorAll<HTMLElement>('[data-step]').forEach((card, i) => {
    if (i === index) card.dataset.active = '';
    else delete card.dataset.active;
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-step-to]').forEach((link, i) => {
    // `aria-current="step"` é exatamente isto: uma etapa dentro de um
    // processo. Não é `tab` — o atalho não esconde nem revela painel
    // nenhum, ele diz em que ponto do método o visitante está.
    if (i === index) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });

  const bar = document.querySelector<HTMLElement>('[data-steps-progress]');
  if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

/**
 * Recuo, encolhimento e giro de cada camada atrás da frente.
 *
 * **O recuo tem que vencer o encolhimento.** O cartão encolhe pelo
 * centro, então a 0,95 de escala o topo dele já desce sozinho 10px num
 * cartão de 386 — com os 16px de recuo da primeira tentativa sobravam
 * 6px de aba e os cartões de trás sumiam inteiros atrás da frente.
 * Com 30 sobram 20px na primeira camada e 41px na segunda, medidos no
 * navegador.
 */
const RECUO = 30;
const ENCOLHE = 0.05;
const GIRO = 3;
/** Fração da largura do cartão que, ao soltar, vira a etapa. */
const VIRADA = 0.26;
/** Abaixo disto o ponteiro não está arrastando — está clicando. */
const LIMIAR = 6;
/** Quanto do arrasto passa quando não há para onde ir. */
const ELASTICO = 0.28;

function cardDeck(): () => void {
  const deck = document.querySelector<HTMLElement>('[data-deck]');
  const cards = deck ? [...deck.querySelectorAll<HTMLElement>('[data-step]')] : [];
  if (!deck || cards.length === 0) return () => {};

  const total = cards.length;
  let index = 0;
  let dx = 0;
  let arrastando = false;
  let id: number | null = null;
  let x0 = 0;

  const largura = () => cards[0]!.getBoundingClientRect().width || 1;

  const pintar = () => {
    cards.forEach((card, i) => {
      const camada = i - index;

      if (camada < 0) {
        // Já passou: sai pela esquerda e some. Volta assim que a mão voltar.
        card.style.transform = 'translate3d(-130%, 0, 0) rotate(-14deg)';
        card.style.opacity = '0';
        card.style.zIndex = '0';
        card.style.pointerEvents = 'none';
        return;
      }

      /**
       * Da terceira camada para trás o cartão para de recuar e fica
       * invisível no lugar do terceiro: um leque de quatro degraus
       * encolheria o último a ponto de virar um filete torto, e ninguém
       * precisa ver a etapa 04 espremida enquanto lê a 01.
       */
      const fundo = Math.min(camada, 2);
      const solto = camada === 0 ? dx : 0;
      const giro = camada === 0 ? (solto / largura()) * 12 : fundo * GIRO;

      card.style.transform =
        `translate3d(${Math.round(solto)}px, ${-fundo * RECUO}px, 0) ` +
        `scale(${(1 - fundo * ENCOLHE).toFixed(3)}) rotate(${giro.toFixed(2)}deg)`;
      card.style.opacity = camada > 2 ? '0' : '1';
      card.style.zIndex = String(total - camada);
      card.style.pointerEvents = camada === 0 ? '' : 'none';
    });

    paintSteps(index, total > 1 ? index / (total - 1) : 1);
  };

  const irPara = (alvo: number) => {
    index = Math.min(total - 1, Math.max(0, alvo));
    pintar();
  };

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary) return;
    id = event.pointerId;
    x0 = event.clientX;
    dx = 0;
    arrastando = false;
  };

  const onMove = (event: PointerEvent) => {
    if (id === null || event.pointerId !== id) return;
    const bruto = event.clientX - x0;

    if (!arrastando) {
      // Os primeiros pixels são clique, não arrasto: sem esta folga o
      // baralho engoliria a seleção de texto do cartão.
      if (Math.abs(bruto) < LIMIAR) return;
      arrastando = true;
      deck.dataset.dragging = '';
      deck.setPointerCapture(id);
    }

    // Nas pontas o cartão resiste em vez de sair — não há para onde ir,
    // e travar seco faria a mão parecer que perdeu o cartão.
    const ponta = (bruto < 0 && index === total - 1) || (bruto > 0 && index === 0);
    dx = ponta ? bruto * ELASTICO : bruto;
    pintar();
  };

  const onUp = (event: PointerEvent) => {
    if (id === null || event.pointerId !== id) return;
    if (arrastando && deck.hasPointerCapture(id)) deck.releasePointerCapture(id);

    const andou = arrastando ? dx : 0;
    const virou = Math.abs(andou) > largura() * VIRADA;

    id = null;
    dx = 0;
    arrastando = false;
    delete deck.dataset.dragging;

    // Solta a mão, a transição do CSS volta a valer: é ela que joga o
    // cartão para fora ou o traz de volta ao lugar.
    if (virou) irPara(index + (andou < 0 ? 1 : -1));
    else pintar();
  };

  /** Clicar numa etapa do atalho traz aquele cartão para a frente. */
  const nav = document.querySelector<HTMLElement>('[data-steps-nav]');
  const onNav = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest?.('[data-step-to]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const alvo = Number(link.dataset.stepTo);
    if (!Number.isFinite(alvo)) return;

    // Antes do tratador global de âncoras: os quatro cartões ocupam o
    // mesmo lugar na tela, então rolar até um deles não leva a nada.
    event.preventDefault();
    irPara(alvo);
  };

  nav?.addEventListener('click', onNav);
  deck.addEventListener('pointerdown', onDown);
  deck.addEventListener('pointermove', onMove);
  deck.addEventListener('pointerup', onUp);
  deck.addEventListener('pointercancel', onUp);

  // Só agora o CSS empilha: até aqui os cartões eram uma lista.
  deck.dataset.on = '';
  pintar();

  return () => {
    nav?.removeEventListener('click', onNav);
    deck.removeEventListener('pointerdown', onDown);
    deck.removeEventListener('pointermove', onMove);
    deck.removeEventListener('pointerup', onUp);
    deck.removeEventListener('pointercancel', onUp);
    delete deck.dataset.on;
    delete deck.dataset.dragging;
    cards.forEach((card) => card.removeAttribute('style'));
    // Devolve a lista ao estado de quem nunca conduziu nada.
    paintSteps(-1, 0);
  };
}
/**
 * A velocidade do scroll inclina o conteúdo de leve e estica a faixa
 * rolante. É o truque que faz a página parecer ter massa: parar de rolar
 * devolve tudo ao lugar.
 */
function velocity(): () => void {
  const marquee = document.querySelector<HTMLElement>('.marquee');
  const skewables = gsap.utils.toArray<HTMLElement>('[data-skew]');
  if (!marquee && skewables.length === 0) return () => {};

  let last = window.scrollY;
  let raf = 0;
  let value = 0;

  const frame = () => {
    const now = window.scrollY;
    const delta = now - last;
    last = now;

    // Suaviza: o valor cru pula demais entre quadros.
    value += (delta - value) * 0.12;
    const clamped = gsap.utils.clamp(-60, 60, value);

    if (marquee) {
      // Rolar para cima inverte o sentido da faixa; parar devolve o
      // sentido original. É o detalhe que faz ela parecer presa ao scroll.
      if (Math.abs(clamped) > 1.5) {
        marquee.style.animationDirection = clamped > 0 ? 'normal' : 'reverse';
      }
      marquee.style.animationDuration = `${Math.max(12, 42 - Math.abs(clamped) * 0.4)}s`;
    }

    if (skewables.length > 0) {
      gsap.set(skewables, { skewY: clamped * 0.055 });
    }

    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    if (marquee) {
      marquee.style.animationDirection = '';
      marquee.style.animationDuration = '';
    }
    if (skewables.length > 0) gsap.set(skewables, { clearProps: 'transform' });
  };
}

/*
 * O pin empilhado das etapas foi removido daqui. Ele mostrava uma etapa
 * de cada vez numa tela de 900px e deixava 70% de vazio — parte do que o
 * cliente chamou de básico. As etapas viraram quatro cartões sobre o
 * bloco escuro, em `sections/home/Method.tsx`.
 *
 * O CSS do modo empilhado continua no `globals.css`, sob
 * `[data-stacked='true']`, caso o efeito 5 do briefing seja retomado.
 */

/** 3 e 9 em `/servicos`: o trilho se desenha e cada marcador acende. */
function timelineTrack() {
  const list = document.querySelector<HTMLElement>('.timeline');
  const fill = document.querySelector<HTMLElement>('[data-timeline-fill]');
  if (!list || !fill) return;

  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 78%', scrub: 0.5 },
    },
  );

  gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 62%',
      onToggle: (self) => {
        item.dataset.active = self.isActive || self.progress > 0 ? 'true' : 'false';
      },
    });
  });
}

/** A rampa sobe ponto a ponto quando a divisória entra. */
function ramps() {
  gsap.utils.toArray<HTMLElement>('[data-ramp]').forEach((ramp) => {
    const dots = ramp.querySelectorAll<HTMLElement>('[data-ramp-dot]');
    if (dots.length === 0) return;

    gsap.from(dots, {
      scale: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: 0.055,
      scrollTrigger: { trigger: ramp, start: 'top 92%', once: true },
      clearProps: 'transform',
    });
  });
}

/**
 * Os rótulos monoespaçados entram embaralhando antes de assentar.
 *
 * Só funciona porque a fonte é monoespaçada: cada caractere sorteado
 * ocupa a mesma largura do certo, então a linha não muda de tamanho
 * enquanto embaralha e nada ao redor se mexe.
 */
function scramble() {
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789—';

  gsap.utils.toArray<HTMLElement>('.label').forEach((label) => {
    // Só rótulo de texto puro. Escrever em `textContent` de um rótulo
    // que tem filhos apagaria esses filhos — o ponto de mostarda do hero
    // sumiria no primeiro embaralhamento.
    if (label.children.length > 0) return;

    const final = label.textContent ?? '';
    if (final.length === 0 || final.length > 60) return;

    ScrollTrigger.create({
      trigger: label,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const state = { progress: 0 };

        gsap.to(state, {
          progress: 1,
          duration: 0.7,
          ease: 'power2.out',
          onUpdate: () => {
            const settled = Math.floor(state.progress * final.length);
            let out = '';

            for (let i = 0; i < final.length; i += 1) {
              const character = final[i] ?? '';
              if (i < settled || character === ' ') {
                out += character;
              } else {
                out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              }
            }

            label.textContent = out;
          },
          onComplete: () => {
            label.textContent = final;
          },
        });
      },
    });
  });
}

/** O bloco de mostarda é pintado de baixo para cima ao entrar. */
function accentWipe() {
  gsap.utils.toArray<HTMLElement>('[data-accent]').forEach((block) => {
    // Mesmo motivo do `darkZones`: a costura de pixels já é a chegada.
    if (block.querySelector('[data-dissolve]')) return;

    gsap.fromTo(
      block,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.8,
        ease: EASE.enter,
        scrollTrigger: { trigger: block, start: 'top 88%', once: true },
        onComplete: () => gsap.set(block, { clearProps: 'clipPath' }),
      },
    );
  });
}

/** 7. Os contadores de `/sobre`, uma vez só. */
function counters() {
  gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((element) => {
    const target = Number(element.dataset.counter ?? '0');
    const suffix = element.dataset.counterSuffix ?? '';
    if (!Number.isFinite(target)) return;

    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: DURATION.counter,
      ease: EASE.counter,
      scrollTrigger: { trigger: element, start: 'top 85%', once: true },
      onUpdate: () => {
        element.textContent = Math.round(state.value) + suffix;
      },
      onComplete: () => {
        element.textContent = target + suffix;
      },
    });
  });
}

/** 8. Ímã leve no botão. Desligado em tela de toque. */
function magnets(): () => void {
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};

  const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  const cleanups: (() => void)[] = [];

  buttons.forEach((button) => {
    const move = (event: MouseEvent) => {
      const box = button.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      const y = ((event.clientY - box.top) / box.height - 0.5) * 2;

      gsap.to(button, {
        x: gsap.utils.clamp(-MAGNET, MAGNET, x * MAGNET),
        y: gsap.utils.clamp(-MAGNET, MAGNET, y * MAGNET) - LIFT,
        duration: DURATION.micro,
        ease: 'power2.out',
      });
    };

    const leave = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1, 0.6)' });
    };

    button.addEventListener('mousemove', move);
    button.addEventListener('mouseleave', leave);

    cleanups.push(() => {
      button.removeEventListener('mousemove', move);
      button.removeEventListener('mouseleave', leave);
      gsap.set(button, { clearProps: 'transform' });
    });
  });

  return () => cleanups.forEach((stop) => stop());
}

/** Âncora `#contato` no mesmo easing do resto, em vez de salto nativo. */
function anchors(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target as Element | null;
    const link = target?.closest?.('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;

    const destination = document.getElementById(id);
    if (!destination) return;

    event.preventDefault();
    const lenis = getLenis();

    if (lenis) lenis.scrollTo(destination, { offset: -96 });
    else destination.scrollIntoView({ behavior: 'smooth' });

    window.history.replaceState(null, '', '#' + id);
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
