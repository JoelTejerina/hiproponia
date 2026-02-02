import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.scss',
})
export class PendingApprovalComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected username = () => this.auth.currentUser()?.username ?? '';
  protected razonSocial = () => this.auth.currentUser()?.razonSocial ?? '';

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
