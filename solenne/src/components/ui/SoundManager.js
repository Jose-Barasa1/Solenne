import { Howl } from 'howler';

export const ambientLoop = new Howl({
  src: ['/sounds/solenne-ambience.mp3'],
  loop: true,
  volume: 0.3,
});

export const playChime = () => {
  const chime = new Howl({ src: ['/sounds/chime.mp3'], volume: 0.5 });
  chime.play();
};
