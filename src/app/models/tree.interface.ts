export interface ITreeConfig {
  title: string;
  data: any[];
  dataKeys: string[];
}

export interface IDimensionsType {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  height: number;
  width: number;
  boundedHeight?: number;
  boundedWidth?: number;
}
