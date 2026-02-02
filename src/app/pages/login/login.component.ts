import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = 'user';
  password = 'user123';
  error = '';

  submit(): void {
    this.error = '';
    const username = this.username.trim();
    const password = this.password;

    if (!username || !password) {
      this.error = 'Ingresa tu usuario y contraseña.';
      return;
    }

    if (!this.auth.login(username, password)) {
      this.error = 'Usuario o contraseña incorrectos.';
      return;
    }

    if (this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.auth.isApproved()) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/pending-approval']);
    }
  }
}
