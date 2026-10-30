
import { Component, Input } from '@angular/core';
import { Product } from '../../services/product';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: Product;

  constructor(private cart: Cart) {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  }

  addToCart(): void {
    this.cart.addToCart(this.product);
    alert(`${this.product.name} added to cart!`);
  }
}
