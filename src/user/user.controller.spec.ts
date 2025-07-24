import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /user', () => {
    it('should return user if found', async () => {
      const user = { id: 1, name: 'John', email: 'john@example.com' };
      mockUserService.getUserById.mockResolvedValue(user);

      const result = await controller.getUser(1);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(user);
    });

    it('should return 404 if user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await controller.getUser(999);
      expect(result.status).toBe(404);
      expect(result.message).toBe('User not found');
    });
  });

  describe('POST /user', () => {
    it('should create user if not exists', async () => {
      const dto = { name: 'Jane', email: 'jane@example.com' };
      mockUserService.getUserByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.createUser(dto);
      expect(result.status).toBe(200);
      expect(result.data.name).toBe('Jane');
    });

    it('should return 409 if user already exists', async () => {
      const dto = { name: 'Jane', email: 'jane@example.com' };
      mockUserService.getUserByEmail.mockResolvedValue(dto);

      const result = await controller.createUser(dto);
      expect(result.status).toBe(409);
      expect(result.message).toBe('User already Exists');
    });
  });

  describe('PUT /user/:id', () => {
    it('should update user if found', async () => {
      const id = 1;
      const dto = { name: 'Updated', email: 'updated@example.com' };
      mockUserService.getUserById.mockResolvedValue({ id, ...dto });
      mockUserService.updateUser.mockResolvedValue({ id, ...dto });

      const result = await controller.updateUser(id, dto);
      expect(result.status).toBe(200);
      expect(result.data.name).toBe('Updated');
    });

    it('should return 404 if user not found', async () => {
      const dto = { name: 'X', email: 'x@example.com' };
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await controller.updateUser(999, dto);
      expect(result.status).toBe(404);
      expect(result.message).toBe('User not found');
    });
  });

  describe('DELETE /user/:id', () => {
    it('should delete user if found', async () => {
      const id = 1;
      mockUserService.getUserById.mockResolvedValue({ id });
      mockUserService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser(id);
      expect(result.status).toBe(200);
      expect(result.message).toBe('User deleted Successfully');
    });

    it('should return 404 if user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await controller.deleteUser(999);
      expect(result.status).toBe(404);
      expect(result.message).toBe('User not found');
    });
  });
});
