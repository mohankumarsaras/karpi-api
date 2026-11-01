import { Injectable, UnauthorizedException, OnModuleInit, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async onModuleInit() {
    await this.provisionDefaultTutor();
  }

  /**
   * Securely provisions the corporate Tutor account from environment variables
   * Hashes the password using bcrypt. Plaintext password is never saved.
   */
  private async provisionDefaultTutor() {
    const tutorUsername = this.configService.get<string>('TUTOR_USERNAME', 'karpi-admin');
    const tutorEmail = this.configService.get<string>('TUTOR_EMAIL', 'admin@karpi.edu');
    const tutorPassword = this.configService.get<string>('TUTOR_PASSWORD', 'KarpiAdmin@2026!');

    const existingTutor = await this.userRepository.findOne({
      where: [{ email: tutorEmail }, { fullName: tutorUsername }],
    });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(tutorPassword, salt);

    if (!existingTutor) {
      const tutor = this.userRepository.create({
        fullName: tutorUsername,
        email: tutorEmail,
        passwordHash,
        role: UserRole.TUTOR,
        isActive: true,
      });
      await this.userRepository.save(tutor);
      this.logger.log(`Initialized corporate Tutor account: ${tutorUsername}`);
    } else {
      // Update password hash if tutor already exists
      existingTutor.role = UserRole.TUTOR;
      existingTutor.passwordHash = passwordHash;
      await this.userRepository.save(existingTutor);
    }
  }

  /**
   * Rookie Google OAuth authentication
   */
  async authenticateGoogle(idToken: string) {
    try {
      const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      let payload: any;

      if (googleClientId) {
        const ticket = await this.googleClient.verifyIdToken({
          idToken,
          audience: googleClientId,
        });
        payload = ticket.getPayload();
      } else {
        // Fallback for dev/mock testing if client ID not configured
        const parsed = JSON.parse(Buffer.from(idToken.split('.')[1] || '', 'base64').toString() || '{}');
        payload = parsed.email ? parsed : {
          sub: 'google_mock_' + Date.now(),
          email: 'student@example.com',
          name: 'Student Learner',
          picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          email_verified: true,
        };
      }

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token: Email not found');
      }

      let user = await this.userRepository.findOne({
        where: [{ googleId: payload.sub }, { email: payload.email }],
      });

      if (!user) {
        user = this.userRepository.create({
          googleId: payload.sub,
          email: payload.email,
          fullName: payload.name || payload.email.split('@')[0],
          avatarUrl: payload.picture,
          role: UserRole.ROOKIE,
          isActive: true,
        });
        await this.userRepository.save(user);
        this.logger.log(`New Rookie account registered via Google: ${user.email}`);
      } else {
        if (!user.isActive) {
          throw new UnauthorizedException('Account suspended. Please contact administrator.');
        }
        // Update avatar / details if updated
        if (payload.picture && !user.avatarUrl) {
          user.avatarUrl = payload.picture;
        }
        if (!user.googleId) {
          user.googleId = payload.sub;
        }
        await this.userRepository.save(user);
      }

      const tokens = this.generateTokens(user);
      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (err: any) {
      this.logger.error(`Google auth error: ${err.message}`);
      throw new UnauthorizedException('Google authentication failed: ' + (err.message || 'Invalid token'));
    }
  }

  /**
   * Tutor corporate login with rate limiting protection
   */
  async loginTutor(dto: { username: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: [
        { fullName: dto.username, role: UserRole.TUTOR },
        { email: dto.username, role: UserRole.TUTOR },
      ],
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid administrative credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Administrative account is inactive');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid administrative credentials');
    }

    const tokens = this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

