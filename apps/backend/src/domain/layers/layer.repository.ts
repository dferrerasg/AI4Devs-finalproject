import { Layer } from './layer.entity';

export interface ILayerRepository {
  save(layer: Layer): Promise<Layer>;
  findById(id: string): Promise<Layer | null>;
}
