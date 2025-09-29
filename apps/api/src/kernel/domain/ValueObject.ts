import { deepEqual } from "../lib";

export abstract class ValueObject<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  public equals(vo: ValueObject<T>, excludeKeys?: [keyof T]): boolean {
    return deepEqual(this.props, vo.props, excludeKeys);
  }
}
