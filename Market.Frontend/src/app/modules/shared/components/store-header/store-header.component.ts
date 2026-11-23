import { Component, inject } from '@angular/core';
import { CurrentUserService } from '../../../../core/services/auth/current-user.service';

/**
 * Zaglavlje prodavnice: logo, pretraga, konvertor, valuta, nalog.
 * Koriste ga PublicLayoutComponent (/, /search, ...) i ClientLayoutComponent (/client/...).
 */
@Component({
  selector: 'app-store-header',
  standalone: false,
  templateUrl: './store-header.component.html',
  styleUrl: './store-header.component.scss'
})
export class StoreHeaderComponent {
  protected currentUser = inject(CurrentUserService);
}
