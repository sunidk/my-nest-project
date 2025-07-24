import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user by ID', async () => {
    const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should get user by email', async () => {
    const mockUser = { id: 2, name: 'Jane', email: 'jane@example.com' };
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await userService.getUserByEmail('jane@example.com');
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'jane@example.com' },
    });
  });

  it('should create a user', async () => {
    const mockUser = { id: 3, name: 'Alice', email: 'alice@example.com' };
    mockPrisma.user.create.mockResolvedValue(mockUser);

    const result = await userService.createUser('Alice', 'alice@example.com');
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
      },
    });
  });

  it('should update a user', async () => {
    const mockUser = { id: 4, name: 'Bob', email: 'bob@example.com' };
    mockPrisma.user.update.mockResolvedValue(mockUser);

    const result = await userService.updateUser(4, 'Bob', 'bob@example.com');
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: {
        name: 'Bob',
        email: 'bob@example.com',
      },
    });
  });

  it('should delete a user', async () => {
    const mockUser = { id: 5, name: 'Charlie', email: 'charlie@example.com' };
    mockPrisma.user.delete.mockResolvedValue(mockUser);

    const result = await userService.deleteUser(5);
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });
});
