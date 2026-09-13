/**
 * O preloader e a manchete precisam combinar: a cortina sai, e só então
 * as linhas do título sobem. Esta promessa é o combinado entre os dois.
 *
 * Quem resolve é sempre o preloader — inclusive na visita repetida, em
 * que ele não aparece e resolve na hora.
 */
let release: (() => void) | null = null;

export const ready = new Promise<void>((resolve) => {
  release = resolve;
});

export function markReady() {
  release?.();
  release = null;
}
