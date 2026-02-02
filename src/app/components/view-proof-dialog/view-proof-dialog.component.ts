import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../models/order.model';

export interface ViewProofData {
  order: Order;
}

@Component({
  selector: 'app-view-proof-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Comprobante de pago — {{ data.order.id }}</h2>
    <mat-dialog-content class="proof-content">
      @if (data.order.proofDataUrl) {
        @if (isImage(data.order.proofMimeType)) {
          <img [src]="data.order.proofDataUrl" [alt]="data.order.proofFileName || 'Comprobante'" class="proof-image" />
        } @else if (isPdf(data.order.proofMimeType)) {
          <iframe [src]="safeProofUrl" class="proof-pdf" title="Comprobante PDF"></iframe>
        } @else {
          <p class="text-muted">Formato no previsto. Puede abrir el archivo en otra pestaña.</p>
          <a [href]="data.order.proofDataUrl" target="_blank" rel="noopener" mat-stroked-button>
            Abrir comprobante en nueva pestaña
          </a>
        }
        @if (data.order.proofFileName) {
          <p class="proof-filename small text-muted mt-2 mb-0">{{ data.order.proofFileName }}</p>
        }
      } @else {
        <p class="text-muted mb-0">No hay comprobante guardado para este pedido.</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .proof-content {
        min-width: 320px;
        max-width: 90vw;
        max-height: 75vh;
        overflow: auto;
      }
      .proof-image {
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 8px;
      }
      .proof-pdf {
        width: 100%;
        min-height: 60vh;
        border: none;
        border-radius: 8px;
      }
      .proof-filename {
        word-break: break-all;
      }
    `,
  ],
})
export class ViewProofDialogComponent {
  readonly data: ViewProofData = inject(MAT_DIALOG_DATA);
  private sanitizer = inject(DomSanitizer);

  get safeProofUrl(): SafeResourceUrl {
    const url = this.data.order.proofDataUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  }

  isImage(mime?: string): boolean {
    return mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/jpg';
  }

  isPdf(mime?: string): boolean {
    return mime === 'application/pdf';
  }
}
