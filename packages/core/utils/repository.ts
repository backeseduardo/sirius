import { DeepPartial } from './deep-partial.type';

export type FindConditions<T> = {
  [P in keyof T]?: T[P] extends never
    ? FindConditions<T[P]>
    : FindConditions<T[P]>;
};

export interface Repository<T = { id: string }> {
  find(conditions?: FindConditions<T>): Promise<T[]>;

  findOne(conditions?: FindConditions<T>): Promise<T | undefined>;

  save(data: DeepPartial<T>): Promise<T>;

  delete(id: string): Promise<void>;
}
