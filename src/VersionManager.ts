import Dependency from './Dependency';
import Family from './Family';

export class VersionManager {
  dependencies: Dependency[];
  families: Family[];

  constructor(families: Family[], dependencies: Dependency[]) {
    this.dependencies = dependencies;
    this.families = families;
  }

  getFamilies(): Family[] {
    return this.families;
  }

  addFamily(newFamily: Family): boolean {
    if (!this.families.includes(newFamily)) {
      this.families.push(newFamily);
      return true;
    }
    return false;
  }

  getDependencies(): Dependency[] {
    return this.dependencies;
  }

  getDependenciesByFamily(family: Family): Dependency[] {
    return this.dependencies.filter((dependency) => {
      return dependency.family === family;
    });
  }

  addDependency(dependency: Dependency): boolean {
    let result = false;
    if (!this.dependencies.includes(dependency)) {
      if (this.families.includes(dependency.family)) {
        this.dependencies.push(dependency);
        result = true;
      }
    }
    return result;
  }
}
