/** Props every lesson visualization receives. `step` is how many replay steps have run (0..total). */
export interface VizProps {
  n: number;
  step: number;
  total: number;
}
