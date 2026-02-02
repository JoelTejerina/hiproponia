import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-perfil',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './admin-perfil.component.html',
  styleUrl: './admin-perfil.component.scss',
})
export class AdminPerfilComponent {
  protected auth = inject(AuthService);
  protected user = this.auth.currentUser;
}
