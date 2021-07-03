import { expect } from 'chai';
import Dependency from './Dependency';
import VersionFinder from './VersionFinder';

describe('version finder behaviour', () => {
  it('should find a single entry when only that single entry exists', () => {
    const dependency = new Dependency();
    const versionFinder = new VersionFinder([dependency]);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(1);
  });
  it('should return only the entry when no dependency for search exist', () => {
    const dependency = new Dependency();
    const unrelatedDependency = new Dependency();
    const storedDependencies: Dependency[] = [dependency, unrelatedDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(1);
  });
  it('should return all dependency linked by dependency', () => {
    const dependency = new Dependency();
    const relatedDependency = new Dependency();
    dependency.dependencies.push(relatedDependency);
    const storedDependencies: Dependency[] = [dependency, relatedDependency];
    const versionFinder = new VersionFinder(storedDependencies);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result.length).to.equal(2);
  });
});
