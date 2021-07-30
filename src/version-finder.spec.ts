import { expect } from 'chai';
import Dependency from './Dependency';
import Family from './Family';
import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';

describe('get pre-reqs for releases', () => {
  it('should find a single entry when only that single entry exists', () => {
    const family = new Family();
    const dependency = new Dependency(Math.random(), new Family(), '', true, []);
    const versionManager = new VersionManager([family], [dependency]);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency]);
  });
  it('should return only the entry when no dependency for search exist', () => {
    const dependencyFamily = new Family();
    const dependency = new Dependency(Math.random(), dependencyFamily, '', true, []);
    const unrelatedDependencyFamily = new Family();
    const unrelatedDependency = new Dependency(Math.random(), unrelatedDependencyFamily, '', true, []);
    const versionManager = new VersionManager(
      [dependencyFamily, unrelatedDependencyFamily],
      [dependency, unrelatedDependency],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency]);
  });
  it('should return all dependency linked by dependency', () => {
    const relatedDependencyFamily = new Family();
    const relatedDependency = new Dependency(Math.random(), relatedDependencyFamily, '', true, []);
    const dependencyFamily = new Family();
    const dependency = new Dependency(Math.random(), dependencyFamily, '', true, [relatedDependency]);
    const versionManager = new VersionManager(
      [relatedDependencyFamily, dependencyFamily],
      [dependency, relatedDependency],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency, relatedDependency]);
  });
  it('should return dependency of dependency', () => {
    const secondLevelDependencyFamily = new Family();
    const secondLevelDependency = new Dependency(Math.random(), secondLevelDependencyFamily, '', true, []);
    const firstLevelDependencyFamily = new Family();
    const firstLevelDependency = new Dependency(Math.random(), firstLevelDependencyFamily, '', true, [
      secondLevelDependency,
    ]);
    const dependencyFamily = new Family();
    const dependency = new Dependency(Math.random(), dependencyFamily, '', true, [firstLevelDependency]);
    const versionManager = new VersionManager(
      [secondLevelDependencyFamily, firstLevelDependencyFamily, dependencyFamily],
      [dependency, firstLevelDependency, secondLevelDependency],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency, firstLevelDependency, secondLevelDependency]);
  });
  it('should look for deeper dependencies until no new families are discovered', () => {
    const superBottomFamily = new Family();
    const superBottomDependency = new Dependency(Math.random(), superBottomFamily, '', true, []);
    const bottomFamily = new Family();
    const bottomDependency = new Dependency(Math.random(), bottomFamily, '', true, [superBottomDependency]);
    const middleFamily = new Family();
    const middleDependency = new Dependency(Math.random(), middleFamily, '', true, [bottomDependency]);
    const topFamily = new Family();
    const topDependency = new Dependency(Math.random(), topFamily, '', true, [middleDependency]);

    const versionManager = new VersionManager(
      [superBottomFamily, bottomFamily, middleFamily, topFamily],
      [superBottomDependency, bottomDependency, middleDependency, topDependency],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([topDependency]);
    expect(result).has.same.members([topDependency, middleDependency, bottomDependency, superBottomDependency]);
  });
  it('should only return a single dependency of each family', () => {
    const familyX = new Family();
    const firstDependencyFromFamilyX = new Dependency(Math.random(), familyX, '', true, []);
    const secondDependencyFromFamilyX = new Dependency(Math.random(), familyX, '', true, []);
    const searchDependencyWithFirstDependencyFamily = new Family();
    const searchDependencyWithFirstDependency = new Dependency(
      Math.random(),
      searchDependencyWithFirstDependencyFamily,
      '',
      true,
      [firstDependencyFromFamilyX],
    );
    const searchDependencyWithSecondDependencyFamily = new Family();
    const searchDependencyWithSecondDependency = new Dependency(
      Math.random(),
      searchDependencyWithSecondDependencyFamily,
      '',
      true,
      [secondDependencyFromFamilyX],
    );

    const versionManager = new VersionManager(
      [familyX, searchDependencyWithFirstDependencyFamily, searchDependencyWithSecondDependencyFamily],
      [
        firstDependencyFromFamilyX,
        secondDependencyFromFamilyX,
        searchDependencyWithFirstDependency,
        searchDependencyWithSecondDependency,
      ],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ]);
    expect(result).has.same.members([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
      firstDependencyFromFamilyX,
    ]);
  });
  it('should only return the latest dependency of each family', () => {
    const familyX = new Family();
    const olderDependencyFromFamilyX = new Dependency(Math.random(), familyX, '1.0', true, []);
    const newerDependencyFromFamilyX = new Dependency(Math.random(), familyX, '2.0', true, []);
    const searchDependencyWithFirstDependencyFamily = new Family();
    const searchDependencyWithFirstDependency = new Dependency(
      Math.random(),
      searchDependencyWithFirstDependencyFamily,
      '',
      true,
      [olderDependencyFromFamilyX],
    );
    const searchDependencyWithSecondDependencyFamily = new Family();
    const searchDependencyWithSecondDependency = new Dependency(
      Math.random(),
      searchDependencyWithSecondDependencyFamily,
      '',
      true,
      [newerDependencyFromFamilyX],
    );

    const versionManager = new VersionManager(
      [familyX, searchDependencyWithFirstDependencyFamily, searchDependencyWithSecondDependencyFamily],
      [
        olderDependencyFromFamilyX,
        newerDependencyFromFamilyX,
        searchDependencyWithFirstDependency,
        searchDependencyWithSecondDependency,
      ],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ]);
    expect(result.includes(newerDependencyFromFamilyX)).to.be.true;
  });
  it('dont return a prerequisite that is no longer supported', () => {
    const unsupportedDependencyFamily = new Family();
    const unsupportedDependency = new Dependency(Math.random(), unsupportedDependencyFamily, '', false, []);
    const searchDependencyFamily = new Family();
    const searchDependency = new Dependency(Math.random(), searchDependencyFamily, '', true, [unsupportedDependency]);

    const versionManager = new VersionManager(
      [unsupportedDependencyFamily, searchDependencyFamily],
      [unsupportedDependency, searchDependency],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([searchDependency]);
    expect(result).has.same.members([searchDependency]);
  });
});

describe('get releases for pre-req', () => {
  it('should find a single item if only one release exists', () => {
    const productToQueryFamily = new Family();
    const productToQuery = new Dependency(Math.random(), productToQueryFamily, '', true, []);
    const singleReleaseFamily = new Family();
    const singleRelease = new Dependency(Math.random(), singleReleaseFamily, '', true, [productToQuery]);
    const versionManager = new VersionManager(
      [productToQueryFamily, singleReleaseFamily],
      [singleRelease, productToQuery],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([productToQuery]);
    expect(result).has.same.members([singleRelease]);
  });
  it('should find latest dependency that supports it', () => {
    const queryProductFamily = new Family();
    const queryProduct = new Dependency(Math.random(), queryProductFamily, '6.4', true, []);
    const tooNewQueryProduct = new Dependency(Math.random(), queryProductFamily, '6.5', true, []);

    const dependencyFamily = new Family();
    const tooOldDependency = new Dependency(Math.random(), dependencyFamily, '1.0', true, [queryProduct]);
    const justRightDependency = new Dependency(Math.random(), dependencyFamily, '2.0', true, [queryProduct]);
    const tooNewDependency = new Dependency(Math.random(), dependencyFamily, '3.0', true, [tooNewQueryProduct]);

    const versionManager = new VersionManager(
      [queryProductFamily, dependencyFamily],
      [queryProduct, tooNewQueryProduct, tooOldDependency, justRightDependency, tooNewDependency],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([queryProduct]);
    expect(result).has.same.members([justRightDependency]);
  });
  it('shouldnt return dependencies that arent supported', () => {
    const productToQueryFamily = new Family();
    const productToQuery = new Dependency(Math.random(), productToQueryFamily, '', true, []);
    const unsupportedReleaseFamily = new Family();
    const unsupportedRelease = new Dependency(Math.random(), unsupportedReleaseFamily, '', false, [productToQuery]);
    const versionManager = new VersionManager(
      [productToQueryFamily, unsupportedReleaseFamily],
      [unsupportedRelease, productToQuery],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([productToQuery]);
    expect(result).has.same.members([]);
  });
  it('if no product matches your version return one from an earlier version', () => {
    const searchFamily = new Family();
    const olderRelease = new Dependency(Math.random(), searchFamily, '1.0', true, []);
    const searchRelease = new Dependency(Math.random(), searchFamily, '2.0', true, []);
    const productFamily = new Family();
    const productForOlderRelease = new Dependency(Math.random(), productFamily, '8.0', true, [olderRelease]);

    const versionManager = new VersionManager(
      [searchFamily, productFamily],
      [olderRelease, searchRelease, productForOlderRelease],
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([searchRelease]);
    expect(result).has.same.members([productForOlderRelease]);
  });
});
