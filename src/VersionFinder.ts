import Dependency from './Dependency';

export class VersionFinder {
  dependencies: Dependency[];

  constructor(dependencies: Dependency[]) {
    this.dependencies = dependencies;
  }

  findDependenciesFor(searchDependencies: Dependency[]): Dependency[] {
    let foundDependencies: Dependency[] = [];
    foundDependencies = foundDependencies.concat(searchDependencies);

    searchDependencies.forEach((dep) => {
      dep.dependencies.forEach((subdep) => {
        foundDependencies.push(subdep);
      });
    });

    return [...new Set(foundDependencies)];
    // return foundDependencies;
  }
}

export default VersionFinder;
