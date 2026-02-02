import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models/user.model';

export interface ConfirmDeleteUserData {
  user: User;
}

@Component({
  selector: 'app-confirm-delete-user-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Eliminar usuario</h2>
    <mat-dialog-content>
      <p>
        ¿Está seguro de que desea eliminar al usuario
        <strong>{{ data.user.username }}</strong>
        @if (data.user.razonSocial) {
          <span> ({{ data.user.razonSocial }})</span>
        }
        ?
      </p>
      <p class="text-warning mb-0">
        Esta acción no se puede deshacer. Se eliminará el usuario y ya no podrá acceder a la tienda.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="warn" (click)="confirm()">
        Eliminar usuario
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        min-width: 320px;
        max-width: 420px;
      }
      .text-warning {
        color: #856404;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class ConfirmDeleteUserDialogComponent {
  readonly data: ConfirmDeleteUserData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDeleteUserDialogComponent>);

  confirm(): void {
    this.dialogRef.close(true);
  }
}
