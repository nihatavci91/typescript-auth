import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { RegisterDto } from '../dto/RegisterDto.js';
import { LoginDto } from '../dto/LoginDto.js';
import { UpdateProfileDto } from '../dto/UpdateProfileDto.js';
import { env } from '../config/env.js';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Bu email zaten kullanılıyor.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Email veya şifre hatalı.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Email veya şifre hatalı.');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      firstName: user.profile?.firstName ?? null,
      lastName: user.profile?.lastName ?? null,
      birthDate: user.profile?.birthDate ?? null,
      address: user.profile?.address ?? null,
      phone: user.profile?.phone ?? null,
    };
  }

  async updateProfile(userId: number, data: UpdateProfileDto) {
    let birthDate: Date | null | undefined;

    if (data.birthDate === null) {
      birthDate = null;
    } else if (data.birthDate !== undefined) {
      birthDate = new Date(`${data.birthDate}T00:00:00.000Z`);

      if (Number.isNaN(birthDate.getTime())) {
        throw new Error('Doğum tarihi YYYY-MM-DD biçiminde olmalıdır.');
      }
    }

    await this.userRepository.upsertProfile(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate,
      address: data.address,
      phone: data.phone,
    });

    return this.getProfile(userId);
  }
}
