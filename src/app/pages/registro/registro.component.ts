import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  username = '';
  password = '';
  confirmPassword = '';
  razonSocial = '';
  email = '';
  error = '';
  success = false;

  submit(): void {
    this.error = '';
    this.success = false;

    const username = this.username.trim();
    const razonSocial = this.razonSocial.trim();

    if (!username || !this.password || !razonSocial) {
      this.error = 'Usuario, contraseña y razón social son obligatorios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    const result = this.userService.register({
      username,
      password: this.password,
      razonSocial,
      email: this.email.trim() || undefined,
    });

    if (!result.success) {
      this.error = result.error ?? 'Error al registrarse.';
      return;
    }

    this.success = true;
    setTimeout(() => this.router.navigate(['/login']), 3500);
  }
}
