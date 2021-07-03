import Dependency from './Dependency';

export class VersionFinder {
  dependencies: Dependency[];

  constructor(dependencies: Dependency[]) {
    this.dependencies = dependencies;
  }

  findDependenciesFor(searchDependencies: Dependency[]): Dependency[] {
    const foundDependencies: Dependency[] = searchDependencies;

    searchDependencies.forEach((dep) => {
      dep.dependencies.forEach((subdep) => {
        foundDependencies.push(subdep);
      });
    });

    return [...new Set(foundDependencies)];
  }
}

export default VersionFinder;
