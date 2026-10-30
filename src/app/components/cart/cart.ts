
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart as CartService } from '../../services/cart';
import { Product } from '../../services/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
constructor(
  public cartService: CartService,
  private router: Router
) {}
  checkCart(): void {
    console.log('Cart items:', this.cartItems);
    console.log('Cart total:', this.totalPrice);
  }

  get cartItems(): Product[] {
    return this.cartService.getCartItems();
  }

  getQuantity(product: Product): number {
    return this.cartService.getQuantity(product);
  }

  increaseQuantity(product: Product): void {
    this.cartService.increaseQuantity(product);
  }

  decreaseQuantity(product: Product): void {
    this.cartService.decreaseQuantity(product);
  }

  
removeProduct(product: Product): void {
  this.cartService.removeFromCart(product);
}


  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  goToCheckout(): void {
  this.router.navigate(['/checkout']);
}
}
