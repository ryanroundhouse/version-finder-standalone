import Family from './Family';

export class Dependency {
  id: number;
  // version: string;
  // releaseDate: Date;
  family: Family;
  dependencies: Dependency[];

  constructor(id: number, family: Family, dependencies: Dependency[]) {
    this.id = id;
    this.family = family;
    this.dependencies = dependencies;
  }
}

export default Dependency;
