import { expect } from 'chai';
import Dependency from './Dependency';
import Family from './Family';
import VersionFinder from './VersionFinder';

describe('get pre-reqs for releases', () => {
  it('should find a single entry when only that single entry exists', () => {
    const dependency = new Dependency(Math.random(), new Family(), '', true, []);
    const versionFinder = new VersionFinder([dependency]);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(1);
  });
  it('should return only the entry when no dependency for search exist', () => {
    const dependency = new Dependency(Math.random(), new Family(), '', true, []);
    const unrelatedDependency = new Dependency(Math.random(), new Family(), '', true, []);
    const storedDependencies: Dependency[] = [dependency, unrelatedDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(1);
  });
  it('should return all dependency linked by dependency', () => {
    const relatedDependency = new Dependency(Math.random(), new Family(), '', true, []);
    const dependency = new Dependency(Math.random(), new Family(), '', true, [relatedDependency]);
    const storedDependencies: Dependency[] = [dependency, relatedDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(2);
  });
  it('should return dependency of dependency', () => {
    const secondLevelDependency = new Dependency(Math.random(), new Family(), '', true, []);
    const firstLevelDependency = new Dependency(Math.random(), new Family(), '', true, [secondLevelDependency]);
    const dependency = new Dependency(Math.random(), new Family(), '', true, [firstLevelDependency]);
    const storedDependencies: Dependency[] = [dependency, firstLevelDependency, secondLevelDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(3);
  });
  it('should only return a single dependency of each family', () => {
    const familyX = new Family();
    const firstDependencyFromFamilyX = new Dependency(Math.random(), familyX, '', true, []);
    const secondDependencyFromFamilyX = new Dependency(Math.random(), familyX, '', true, []);

    const searchDependencyWithFirstDependency = new Dependency(Math.random(), new Family(), '', true, [
      firstDependencyFromFamilyX,
    ]);
    const searchDependencyWithSecondDependency = new Dependency(Math.random(), new Family(), '', true, [
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
    const olderDependencyFromFamilyX = new Dependency(Math.random(), familyX, '1.0', true, []);
    const newerDependencyFromFamilyX = new Dependency(Math.random(), familyX, '2.0', true, []);

    const searchDependencyWithFirstDependency = new Dependency(Math.random(), new Family(), '', true, [
      olderDependencyFromFamilyX,
    ]);
    const searchDependencyWithSecondDependency = new Dependency(Math.random(), new Family(), '', true, [
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
  it('dont return a prerequisite that is no longer supported', () => {
    const unsupportedDependency = new Dependency(Math.random(), new Family(), '', false, []);
    const searchDependency = new Dependency(Math.random(), new Family(), '', true, [unsupportedDependency]);

    const storedDependencies: Dependency[] = [unsupportedDependency, searchDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([searchDependency]);
    expect(result.length).to.equal(1);
  });
});

describe('get releases for pre-req', () => {
  it('should find a single item if only one release exists', () => {
    const productToQuery = new Dependency(Math.random(), new Family(), '', false, []);
    const singleRelease = new Dependency(Math.random(), new Family(), '', false, [productToQuery]);
    const storedDependencies: Dependency[] = [singleRelease, productToQuery];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.whatProductsCanIRunWithDependency([productToQuery]);
    expect(result).has.same.members([singleRelease]);
  });
  it('should find latest dependency that supports it', () => {
    const queryProductFamily = new Family();
    const queryProduct = new Dependency(Math.random(), queryProductFamily, '6.4', false, []);
    const tooNewQueryProduct = new Dependency(Math.random(), queryProductFamily, '6.5', false, []);

    const dependencyFamily = new Family();
    const tooOldDependency = new Dependency(Math.random(), dependencyFamily, '1.0', false, [queryProduct]);
    const justRightDependency = new Dependency(Math.random(), dependencyFamily, '2.0', false, [queryProduct]);
    const tooNewDependency = new Dependency(Math.random(), dependencyFamily, '3.0', false, [tooNewQueryProduct]);

    const storedDependencies: Dependency[] = [
      queryProduct,
      tooNewQueryProduct,
      tooOldDependency,
      justRightDependency,
      tooNewDependency,
    ];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.whatProductsCanIRunWithDependency([queryProduct]);
    expect(result).has.same.members([justRightDependency]);
  });
});
