'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

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
 * Orçamento de `scrub` por rota (limite do briefing: 2):
 * - `/`         → preenchimento do parágrafo + trilho horizontal
 * - `/servicos` → trilho da linha do tempo
 * - `/sobre`    → nenhum
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
      videoReveal();
      fillOnScroll();
      horizontalSteps();
      timelineTrack();
      counters();
      ramps();
      scramble();
      accentWipe();
    });

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
 * 5. O `scrub` das etapas: a seção trava e o scroll vertical empurra o
 * trilho de lado.
 *
 * Só acima de 1024px. No celular sequestrar o scroll é hostil — e o
 * briefing pede lista simples —, então lá o trilho continua sendo uma
 * lista que rola no dedo.
 *
 * A distância de scroll é a sobra do trilho, medida a cada `refresh`:
 * assim o trilho para exatamente quando o último cartão encosta na
 * margem, em qualquer largura de tela.
 */
function horizontalSteps() {
  const media = gsap.matchMedia();

  media.add('(min-width: 1024px)', () => {
    const stage = document.querySelector<HTMLElement>('[data-steps-pin]');
    const track = document.querySelector<HTMLElement>('[data-track]');
    if (!stage || !track) return;

    const overflow = () => Math.max(0, track.scrollWidth - track.clientWidth);
    if (overflow() === 0) return;

    gsap.to(track, {
      x: () => -overflow(),
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => '+=' + (overflow() + window.innerHeight * 0.4),
        pin: stage,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    window.dispatchEvent(new Event(LAYOUT_EVENT));
  });
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
