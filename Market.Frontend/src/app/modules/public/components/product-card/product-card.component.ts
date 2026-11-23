import { Component, Input } from '@angular/core';

/**
 * Podaci za karticu proizvoda – odgovaraju i proizvodu sa /Catalog/home i sa /Products.
 */
export interface ProductCardItem {
  id: number;
  name: string;
  description?: string | null;
  /** cijena u KM */
  price: number;
  categoryName: string;
  imageUrl: string | null;
  /** nepoznato (undefined) → proizvod se smatra dostupnim */
  stockQuantity?: number;
}

/**
 * Kartica proizvoda (početna stranica, pretraga): slika, naziv, cijena u odabranoj valuti.
 */
@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardItem;

  get outOfStock(): boolean {
    return this.product.stockQuantity !== undefined && this.product.stockQuantity <= 0;
  }
}
