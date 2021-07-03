export class Dependency {
  id: number = Math.random();
  dependencies: Dependency[] = [];
}

export default Dependency;
