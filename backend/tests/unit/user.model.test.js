import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { User } from '../../src/models/user.model.js';

describe('User Model Unit Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should hash the password before saving and set default role to "user"', async () => {
    const rawPassword = 'Password123!';
    const user = await User.create({
      name: 'John Doe',
      email: 'John@Example.COM',
      password: rawPassword,
    });

    expect(user.role).toBe('user');
    expect(user.email).toBe('john@example.com'); // lowercased
    expect(user.password).not.toBe(rawPassword);
    expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format

    const isMatch = await user.comparePassword(rawPassword);
    expect(isMatch).toBe(true);
    const isWrongMatch = await user.comparePassword('WrongPassword123');
    expect(isWrongMatch).toBe(false);
  });

  it('should not return password by default on queries and JSON serialization', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123!',
    });

    const foundUser = await User.findById(user._id);
    expect(foundUser.password).toBeUndefined();

    const jsonUser = foundUser.toJSON();
    expect(jsonUser.password).toBeUndefined();
    expect(jsonUser.__v).toBeUndefined();
  });

  it('should reject duplicate email addresses', async () => {
    await User.create({
      name: 'User One',
      email: 'unique@example.com',
      password: 'Password123!',
    });

    await expect(
      User.create({
        name: 'User Two',
        email: 'unique@example.com',
        password: 'Password123!',
      })
    ).rejects.toThrow();
  });
});
