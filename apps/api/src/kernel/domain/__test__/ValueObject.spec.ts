import { ValueObject } from "../ValueObject";

describe("ValueObject", () => {
  it("should create a ValueObject with the given properties", () => {
    interface Props {
      name: string;
      age: number;
    }

    class TestValueObject extends ValueObject<Props> {
      private constructor(props: Props) {
        super(props);
      }

      public static from(props: Props): TestValueObject {
        return new TestValueObject({ ...props });
      }

      public get name() {
        return this.props.name;
      }

      public get age() {
        return this.props.age;
      }
    }

    const valueObject = TestValueObject.from({ name: "John", age: 30 });
    expect(valueObject).toBeInstanceOf(TestValueObject);
    expect(valueObject.name).toBe("John");
    expect(valueObject.age).toBe(30);
  });

  it("should correctly evaluate structural equality", () => {
    interface Props {
      name: string;
      age: number;
    }

    class TestValueObject extends ValueObject<Props> {
      private constructor(props: Props) {
        super(props);
      }

      public static from(props: Props): TestValueObject {
        return new TestValueObject({ ...props });
      }
    }

    const valueObject1 = TestValueObject.from({ name: "John", age: 30 });
    const valueObject2 = TestValueObject.from({ name: "John", age: 30 });
    const valueObject3 = TestValueObject.from({ name: "Jane", age: 25 });

    expect(valueObject1.equals(valueObject2)).toBe(true);
    expect(valueObject1.equals(valueObject3)).toBe(false);
  });

  it("should correctly evaluate structural equality with excluded properties", () => {
    interface Props {
      id: string;
      name: string;
      age: number;
    }

    class TestValueObject extends ValueObject<Props> {
      private constructor(props: Props) {
        super(props);
      }

      public static from(props: Props): TestValueObject {
        return new TestValueObject({ ...props });
      }

      public override equals(vo: ValueObject<Props>): boolean {
        return super.equals(vo, ["id"]);
      }
    }

    const valueObject1 = TestValueObject.from({
      id: "1",
      name: "John",
      age: 30,
    });
    const valueObject2 = TestValueObject.from({
      id: "2",
      name: "John",
      age: 30,
    });
    const valueObject3 = TestValueObject.from({
      id: "1",
      name: "Jane",
      age: 25,
    });

    expect(valueObject1.equals(valueObject2)).toBe(true);
    expect(valueObject1.equals(valueObject3)).toBe(false);
  });
});
