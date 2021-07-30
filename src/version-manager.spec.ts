import { expect } from 'chai';
import Dependency from './Dependency';
import Family from './Family';
import { VersionManager } from './VersionManager';

describe('version manager family tests', () => {
  it('add family adds a family', () => {
    const versionManager = new VersionManager([], []);
    const newFamily = new Family();
    const result = versionManager.addFamily(newFamily);

    expect(versionManager.families).has.same.members([newFamily]);
    expect(result).to.be.true;
  });
  it('get families gets families', () => {
    const newFamily = new Family();
    const versionManager = new VersionManager([newFamily], []);

    const addedFamilities = versionManager.getFamilies();
    expect(addedFamilities).has.same.members([newFamily]);
  });
  it('add family wont add duplicate family', () => {
    const newFamily = new Family();
    const versionManager = new VersionManager([newFamily], []);
    const result = versionManager.addFamily(newFamily);

    expect(versionManager.families).has.same.members([newFamily]);
    expect(result).to.be.false;
  });
});
describe('version manager dependency tests', () => {
  it('get dependencies gets dependencies', () => {
    const newDependency = new Dependency(Math.random(), new Family(), '', true, []);
    const versionManager = new VersionManager([], [newDependency]);

    const dependencies = versionManager.getDependencies();
    expect(dependencies).has.same.members([newDependency]);
  });
  it('get dependencies by family gets only dependencies by family', () => {
    const family = new Family();
    const familyDependency = new Dependency(Math.random(), family, '', true, []);
    const nonFamilyDependency = new Dependency(Math.random(), new Family(), '', true, []);
    const versionManager = new VersionManager([], [familyDependency, nonFamilyDependency]);

    const dependencies = versionManager.getDependenciesByFamily(family);
    expect(dependencies).has.same.members([familyDependency]);
  });
  it('add dependency adds a dependency', () => {
    const family = new Family();
    const dependency = new Dependency(Math.random(), family, '', true, []);
    const versionManager = new VersionManager([family], []);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.true;
    expect(versionManager.dependencies).has.same.members([dependency]);
  });
  it('add dependency fails when the family isnt present', () => {
    const dependency = new Dependency(Math.random(), new Family(), '', true, []);
    const versionManager = new VersionManager([], []);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([]);
  });
  it('add dependency fails when the dependency already exists', () => {
    const family = new Family();
    const dependency = new Dependency(Math.random(), family, '', true, []);
    const versionManager = new VersionManager([family], [dependency]);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([dependency]);
  });
});
