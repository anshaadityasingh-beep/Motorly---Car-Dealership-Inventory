import { connectTestDB, clearTestDB, closeTestDB } from '../setup/db.js';
import { User } from '../../src/models/user.model.js';
import { seedAdminUser } from '../../src/services/auth.service.js';

describe('Admin Seeding Unit Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create a new admin user when none exists', async () => {
    const adminData = {
      name: 'Super Admin',
      email: 'admin@cardealership.com',
      password: 'AdminPassword123!',
    };

    const result = await seedAdminUser(adminData);
    expect(result.created).toBe(true);
    expect(result.user.role).toBe('admin');
    expect(result.user.email).toBe('admin@cardealership.com');

    const adminInDB = await User.findOne({ email: 'admin@cardealership.com' });
    expect(adminInDB).toBeDefined();
    expect(adminInDB.role).toBe('admin');
  });

  it('should be idempotent and update existing admin password/role if already present', async () => {
    const adminData = {
      name: 'Super Admin',
      email: 'admin@cardealership.com',
      password: 'AdminPassword123!',
    };

    // First run creates
    await seedAdminUser(adminData);

    // Second run with updated password
    const result2 = await seedAdminUser({
      ...adminData,
      password: 'NewAdminPassword456!',
    });

    expect(result2.created).toBe(false);
    expect(result2.updated).toBe(true);

    const count = await User.countDocuments({ email: 'admin@cardealership.com' });
    expect(count).toBe(1);

    const adminInDB = await User.findOne({ email: 'admin@cardealership.com' }).select('+password');
    const isNewPassValid = await adminInDB.comparePassword('NewAdminPassword456!');
    expect(isNewPassValid).toBe(true);
  });
});
