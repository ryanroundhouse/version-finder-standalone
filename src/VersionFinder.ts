import Dependency from './Dependency';
import Family from './Family';

export class VersionFinder {
  dependencies: Dependency[];

  constructor(dependencies: Dependency[]) {
    this.dependencies = dependencies;
  }

  findDependenciesFor(searchDependencies: Dependency[]): Dependency[] {
    const foundDependencies: Dependency[] = searchDependencies;

    searchDependencies.forEach((dep) => {
      dep.dependencies.forEach((subDep) => {
        subDep.dependencies.forEach((subSubDep) => {
          foundDependencies.push(subSubDep);
        });
        foundDependencies.push(subDep);
      });
    });

    const foundFamilies: Family[] = getFamiliesFromDependency(foundDependencies);

    const foundDependenciesWithLatestFromEachFamily: Dependency[] = removeEarlierDependenciesFromDuplicateFamilies(
      foundDependencies,
      foundFamilies,
    );

    return [...new Set(foundDependenciesWithLatestFromEachFamily)];
  }
}

export default VersionFinder;

function getFamiliesFromDependency(foundDependencies: Dependency[]): Family[] {
  const foundFamilies: Family[] = [];
  foundDependencies.forEach((dep) => {
    const matchingDependencies = foundFamilies.filter((family) => {
      return family === dep.family;
    });
    if (matchingDependencies.length < 1) {
      foundFamilies.push(dep.family);
    }
  });
  return foundFamilies;
}
function removeEarlierDependenciesFromDuplicateFamilies(
  foundDependencies: Dependency[],
  foundFamilies: Family[],
): Dependency[] {
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
