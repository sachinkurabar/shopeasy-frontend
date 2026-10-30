
import { Injectable, signal } from '@angular/core';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private cartItems: CartItem[] = [];

  // Reactive cart count for the header.
  readonly cartCount = signal(0);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('shopeasy-cart');

    if (!savedCart) {
      this.cartItems = [];
      this.cartCount.set(0);
      return;
    }

    try {
      const savedItems: unknown = JSON.parse(savedCart);

      if (!Array.isArray(savedItems)) {
        this.cartItems = [];
        this.saveCart();
        return;
      }

      this.cartItems = savedItems
        .map((item: any): CartItem | null => {
          // Restore items saved in the old Product[] format.
          if (item && item.product === undefined && item.id !== undefined) {
            return {
              product: item as Product,
              quantity: 1,
            };
          }

          // Restore items saved in the CartItem format.
          if (
            item?.product &&
            typeof item.quantity === 'number' &&
            item.quantity >= 1
          ) {
            return {
              product: item.product as Product,
              quantity: Math.floor(item.quantity),
            };
          }

          return null;
        })
        .filter((item): item is CartItem => item !== null);

      this.saveCart();
    } catch {
      this.cartItems = [];
      this.saveCart();
    }
  }

  private saveCart(): void {
    localStorage.setItem(
      'shopeasy-cart',
      JSON.stringify(this.cartItems)
    );

    // Keep the header count synchronized with the cart.
    this.cartCount.set(this.getCartCount());
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        product,
        quantity: 1,
      });
    }

    this.saveCart();

    console.log('Product added:', product.name);
    console.log('Cart quantity:', this.getCartCount());
  }

  getCartItems(): Product[] {
    return this.cartItems.map(item => item.product);
  }

  getQuantity(product: Product): number {
    return (
      this.cartItems.find(item => item.product.id === product.id)
        ?.quantity ?? 0
    );
  }

  increaseQuantity(product: Product): void {
    const item = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (item) {
      item.quantity++;
      this.saveCart();
    }
  }

  decreaseQuantity(product: Product): void {
    const item = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (item && item.quantity > 1) {
      item.quantity--;
      this.saveCart();
    }
  }

  removeFromCart(product: Product): void {
    this.cartItems = this.cartItems.filter(
      item => item.product.id !== product.id
    );

    this.saveCart();
  }

  getCartCount(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }
}
