import { User } from "../User";

describe("User, create()", () => {
  it("should create a user", () => {
    const id = "123";
    const username = "JohnDoe";
    const email = "johndoe@example.com";
    const createdAt = new Date();
    const userInfo = User.create({
      id,
      username,
      email,
      createdAt,
    });

    expect(userInfo.id).toBe(id);
    expect(userInfo.username).toBe(username);
    expect(userInfo.email).toBe(email);
    expect(userInfo.createdAt).toBe(createdAt);
  });
});
