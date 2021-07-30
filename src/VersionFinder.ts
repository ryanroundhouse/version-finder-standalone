import Dependency from './Dependency';
import Family from './Family';
import { VersionManager } from './VersionManager';

export class VersionFinder {
  versionManager: VersionManager;

  constructor(versionManager: VersionManager) {
    this.versionManager = versionManager;
  }

  whatProductsCanIRunWithDependency(productsToQuery: Dependency[]): Dependency[] {
    const foundDependencies: Dependency[] = [];

    const allFamilies: Family[] = this.getFamiliesFromDependencies(this.versionManager.getDependencies());
    const searchFamilies: Family[] = this.getFamiliesFromDependencies(productsToQuery);

    allFamilies.forEach((family) => {
      const familyReleases = this.versionManager.getDependenciesByFamily(family);
      familyReleases.forEach((familyRelease) => {
        if (
          familyRelease.dependencies.some((dependency) => {
            return searchFamilies.includes(dependency.family);
          })
        ) {
          if (familyRelease.supported && !this.isTooNew(familyRelease, productsToQuery)) {
            foundDependencies.push(familyRelease);
          }
        }
      });
    });

    const foundDependenciesWithLatestFromEachFamily: Dependency[] = this.removeEarlierDependenciesFromDuplicateFamilies(
      foundDependencies,
      allFamilies,
    );

    return foundDependenciesWithLatestFromEachFamily;
  }

  isTooNew(familyRelease: Dependency, productsToQuery: Dependency[]): boolean {
    let isTooNew = false;
    familyRelease.dependencies.forEach((familyDependency) => {
      const productToQuery = productsToQuery.find((productToQuery) => {
        return familyDependency.family === productToQuery.family;
      });
      if (Dependency.isGreaterThan(productToQuery, familyDependency)) {
        isTooNew = true;
      }
    });
    return isTooNew;
  }

  findSubDependencies(dependencies: Dependency[], families: Family[]): Dependency[] {
    dependencies.forEach((dependency) => {
      dependency.dependencies.forEach((subDependency) => {
        if (subDependency.supported) {
          dependencies.push(subDependency);
        }
      });
    });
    const newFamilies = this.getFamiliesFromDependencies(dependencies);
    if (newFamilies > families) {
      return this.findSubDependencies(dependencies, newFamilies);
    } else {
      return dependencies;
    }
  }

  findDependenciesFor(searchDependencies: Dependency[]): Dependency[] {
    const searchDependencyFamilies = this.getFamiliesFromDependencies(searchDependencies);
    const foundDependencies = this.findSubDependencies(searchDependencies, searchDependencyFamilies);
    const foundFamilies: Family[] = this.getFamiliesFromDependencies(foundDependencies);
    const foundDependenciesWithLatestFromEachFamily: Dependency[] = this.removeEarlierDependenciesFromDuplicateFamilies(
      foundDependencies,
      foundFamilies,
    );

    return [...new Set(foundDependenciesWithLatestFromEachFamily)];
  }

  getFamiliesFromDependencies(foundDependencies: Dependency[]): Family[] {
    const families = [
      ...new Set(
        foundDependencies.map((dependency) => {
          return dependency.family;
        }),
      ),
    ];
    return families;
  }

  removeEarlierDependenciesFromDuplicateFamilies(
    foundDependencies: Dependency[],
    foundFamilies: Family[],
  ): Dependency[] {
    foundDependencies.sort(Dependency.compare);

    foundFamilies.forEach((foundFamily) => {
      const dependenciesByFamily = foundDependencies.filter((foundDependency) => {
        return foundDependency.family === foundFamily;
      });
      if (dependenciesByFamily.length > 1) {
        let dontRemoveThisOne = true;
        dependenciesByFamily.forEach((dep) => {
          if (dontRemoveThisOne) {
            dontRemoveThisOne = false;
          } else {
            const dependencyIndexToRemove = foundDependencies.indexOf(dep);
            foundDependencies.splice(dependencyIndexToRemove, 1);
          }
        });
      }
    });
    return foundDependencies;
  }
}

export default VersionFinder;
