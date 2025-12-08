import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
@Injectable()
export class AuthService {
    constructor(
        private usersSerive: UsersService,
        private jwtService: JwtService
    ) {}

    async login(loginDto: any) {
        // Buscamos el usuario por email
        const user = await this.usersSerive.findOneByEmailWithPassword(loginDto.email);

        // Si no existe o la contraseña no coincide... error
        if(!user || !bcrypt.compareSync(loginDto.password, user.password)) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // Generamos el token
        const payload = { sub: user.id, email: user.email, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        };
    }
}
