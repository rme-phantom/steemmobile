export const calculatePowerUsage = (Wp: number): number => {
  const Pu = (Wp + 0.0049) / 50;
  return Pu;
};
