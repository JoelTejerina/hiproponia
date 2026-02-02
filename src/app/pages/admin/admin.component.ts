import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ConfirmDeleteUserDialogComponent } from '../../components/confirm-delete-user-dialog/confirm-delete-user-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  readonly clients = this.userService.clients;

  approveUser(user: User, approved: boolean): void {
    this.userService.setApproved(user.id, approved);
  }

  openConfirmDelete(user: User): void {
    const ref = this.dialog.open(ConfirmDeleteUserDialogComponent, {
      data: { user },
      width: 'min(420px, 95vw)',
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(user.id);
      }
    });
  }
}
