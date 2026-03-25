import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async create(data: Partial<User>): Promise<User> {
    if (data.passwordHash) {
      data.passwordHash = await this.hashPassword(data.passwordHash);
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'workspaceId'],
    });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return isMatch ? user : null;
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.role = role;
    return this.userRepository.save(user);
  }

  private async findByField<K extends keyof User>(
    field: K,
    value: User[K],
  ): Promise<User | null> {
    return this.userRepository.findOne({ where: { [field]: value } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.findByField('email', email);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.findByField('id', id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
