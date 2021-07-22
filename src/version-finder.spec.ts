import { expect } from 'chai';
import Dependency from './Dependency';
import Family from './Family';
import VersionFinder from './VersionFinder';

describe('version finder behaviour', () => {
  it('should find a single entry when only that single entry exists', () => {
    const dependency = new Dependency(Math.random(), new Family(), '', []);
    const versionFinder = new VersionFinder([dependency]);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(1);
  });
  it('should return only the entry when no dependency for search exist', () => {
    const dependency = new Dependency(Math.random(), new Family(), '', []);
    const unrelatedDependency = new Dependency(Math.random(), new Family(), '', []);
    const storedDependencies: Dependency[] = [dependency, unrelatedDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(1);
  });
  it('should return all dependency linked by dependency', () => {
    const relatedDependency = new Dependency(Math.random(), new Family(), '', []);
    const dependency = new Dependency(Math.random(), new Family(), '', [relatedDependency]);
    const storedDependencies: Dependency[] = [dependency, relatedDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(2);
  });
  it('should return dependency of dependency', () => {
    const secondLevelDependency = new Dependency(Math.random(), new Family(), '', []);
    const firstLevelDependency = new Dependency(Math.random(), new Family(), '', [secondLevelDependency]);
    const dependency = new Dependency(Math.random(), new Family(), '', [firstLevelDependency]);
    const storedDependencies: Dependency[] = [dependency, firstLevelDependency, secondLevelDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(3);
  });
  it('should only return a single dependency of each family', () => {
    const familyX = new Family();
    const firstDependencyFromFamilyX = new Dependency(Math.random(), familyX, '', []);
    const secondDependencyFromFamilyX = new Dependency(Math.random(), familyX, '', []);

    const searchDependencyWithFirstDependency = new Dependency(Math.random(), new Family(), '', [
      firstDependencyFromFamilyX,
    ]);
    const searchDependencyWithSecondDependency = new Dependency(Math.random(), new Family(), '', [
      secondDependencyFromFamilyX,
    ]);

    const storedDependencies: Dependency[] = [
      firstDependencyFromFamilyX,
      secondDependencyFromFamilyX,
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ]);
    expect(result.length).to.equal(3);
  });
  it('should only return the latest dependency of each family', () => {
    const familyX = new Family();
    const olderDependencyFromFamilyX = new Dependency(Math.random(), familyX, '1.0', []);
    const newerDependencyFromFamilyX = new Dependency(Math.random(), familyX, '2.0', []);

    const searchDependencyWithFirstDependency = new Dependency(Math.random(), new Family(), '', [
      olderDependencyFromFamilyX,
    ]);
    const searchDependencyWithSecondDependency = new Dependency(Math.random(), new Family(), '', [
      newerDependencyFromFamilyX,
    ]);

    const storedDependencies: Dependency[] = [
      olderDependencyFromFamilyX,
      newerDependencyFromFamilyX,
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ]);
    expect(result.includes(newerDependencyFromFamilyX)).to.be.true;
  });
});
