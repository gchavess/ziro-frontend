export interface OptionDTO {
  label: string;
  value?: number | null;
  children?: OptionDTO[];
}
