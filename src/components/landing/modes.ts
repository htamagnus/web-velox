export const ROUTE = { km: 30, climb: 200 };
// a previsão genérica que a página cita: mais de 2 horas pra 30 km
export const GENERIC_MINUTES = 130;
// médias típicas por modalidade; a da Speed bate com a tabela de rotas (30 km → 1h20)
export const MODES = [
  { id: 'road', speed: 22.5 },
  { id: 'mtb', speed: 15 },
  { id: 'general', speed: 18 },
] as const;
export type Mode = (typeof MODES)[number];
export const minutesFor = (speed: number) => Math.round((ROUTE.km / speed) * 60);
