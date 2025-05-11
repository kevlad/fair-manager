import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto, tenantId?: string | null): Promise<UserResponseDto> {
    const exists = await this.repo.findOne({ where: { email: dto.email, tenantId } });
    if (exists) throw new ConflictException('Email exists');

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const entity = this.repo.create({
      ...dto,
      id: uuidv4(),
      hashedPassword,
      tenantId,
      isActive: true,
      isEmailVerified: false,
    });
    try {
      const saved = await this.repo.save(entity);
      return new UserResponseDto(saved);
    } catch {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findAll(options: { page: number; limit: number; search?: string; tenantId?: string | null }) {
    const users = await this.repo.find({ where: { tenantId: options.tenantId } });
    return users.map((u) => new UserResponseDto(u));
  }

  async findOne(id: string, tenantId?: string | null): Promise<UserResponseDto> {
    const user = await this.repo.findOne({ where: { id, tenantId } });
    if (!user) throw new NotFoundException();
    return new UserResponseDto(user);
  }

  async update(id: string, dto: UpdateUserDto, tenantId?: string | null): Promise<UserResponseDto> {
    const user = await this.repo.preload({ id, tenantId, ...dto });
    if (!user) throw new NotFoundException();
    if (dto.password) user.hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const updated = await this.repo.save(user);
    return new UserResponseDto(updated);
  }

  async remove(id: string, tenantId?: string | null): Promise<void> {
    const res = await this.repo.delete({ id, tenantId });
    if (res.affected === 0) throw new NotFoundException();
  }
}
