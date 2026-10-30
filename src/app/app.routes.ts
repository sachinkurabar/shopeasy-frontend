
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { OrderHistory } from './components/order-history/order-history';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: 'checkout',
    component: Checkout
  }, 
  {
  path: 'orders',
  component: OrderHistory
}
];
