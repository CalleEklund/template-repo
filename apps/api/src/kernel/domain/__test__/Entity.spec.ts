import { Entity } from "../Entity";

describe("Entity", () => {
  it("should create an entity with a unique id", () => {
    interface Props {
      id: string;
    }

    class TestEntity extends Entity<Props> {
      private constructor(props: Props) {
        super(props);
      }

      public static create(): TestEntity {
        return new TestEntity({
          id: "unique-id",
        });
      }

      public static reconstitute(props: Props): TestEntity {
        return new TestEntity({ ...props });
      }

      public get id() {
        return this.props.id;
      }
    }

    const entity = TestEntity.create();
    expect(entity).toBeInstanceOf(TestEntity);
    expect(entity.id).toBe("unique-id");
  });

  it("should reconstitute an entity from props", () => {
    interface Props {
      id: string;
    }

    class TestEntity extends Entity<Props> {
      private constructor(props: Props) {
        super(props);
      }

      public static create(): TestEntity {
        return new TestEntity({
          id: "unique-id",
        });
      }

      public static reconstitute(props: Props): TestEntity {
        return new TestEntity({ ...props });
      }

      public get id() {
        return this.props.id;
      }
    }

    const props = { id: "reconstituted-id" };
    const entity = TestEntity.reconstitute(props);
    expect(entity).toBeInstanceOf(TestEntity);
    expect(entity.id).toBe("reconstituted-id");
  });
});
