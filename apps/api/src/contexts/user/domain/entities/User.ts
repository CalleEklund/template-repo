import { randomUUID } from "crypto";
import { Entity } from "~/kernel/domain";

interface Props {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export class User extends Entity<Props> {
  private constructor(props: Props) {
    super(props);
  }

  public static reconstitute({
    id,
    username,
    email,
    createdAt,
  }: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
  }): User {
    return new User({
      id,
      username,
      email,
      createdAt,
    });
  }

  public static create({
    id,
    username,
    email,
    createdAt,
  }: {
    id?: string;
    username: string;
    email: string;
    createdAt?: Date;
  }): User {
    return new User({
      id: id ?? randomUUID(),
      username,
      email,
      createdAt: createdAt ?? new Date(),
    });
  }
  public get id() {
    return this.props.id;
  }
  public get username() {
    return this.props.username;
  }
  public get email() {
    return this.props.email;
  }
  public get createdAt() {
    return this.props.createdAt;
  }
}
