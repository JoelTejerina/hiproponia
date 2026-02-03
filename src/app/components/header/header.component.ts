import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  protected cartCount = inject(CartService).itemCount;
  protected userEmail = this.auth.currentUser;
  /** true cuando la pantalla es menor que 992px (modo responsive, mismo criterio que d-lg-flex). */
  protected isMobile = signal(false);
  searchQuery = '';

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 991.98px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => this.isMobile.set(state.matches));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onSearchChange(): void {
    this.productService.setSearch(this.searchQuery);
  }
}
