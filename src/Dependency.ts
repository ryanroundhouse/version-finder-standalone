import Family from './Family';

export class Dependency {
  id: number;
  version: string;
  supported: boolean;
  family: Family;
  dependencies: Dependency[];

  constructor(id: number, family: Family, version: string, supported: boolean, dependencies: Dependency[]) {
    this.id = id;
    this.family = family;
    this.version = version;
    this.supported = supported;
    this.dependencies = dependencies;
  }

  static compare(firstDependency: Dependency, secondDependency: Dependency): number {
    return secondDependency.version.localeCompare(firstDependency.version);
  }
}

export default Dependency;
