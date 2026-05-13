export interface PriceParams {
  distanciaKm: number;
  tempoMin: number;
  tarifaBase?: number;
  tarifaKm?: number;
  tarifaMin?: number;
  multiplicador?: number;
}

export function calcularPrecoCorrida({
  distanciaKm,
  tempoMin,
  tarifaBase = 4,
  tarifaKm = 2.5,
  tarifaMin = 0.4,
  multiplicador = 1,
}: PriceParams): number {
  const preco = (tarifaBase + distanciaKm * tarifaKm + tempoMin * tarifaMin) * multiplicador;
  return Math.round(preco * 100) / 100;
}

export function getMultiplicadorDinamico(): number {
  const hour = new Date().getHours();
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) return 1.2;
  return 1;
}