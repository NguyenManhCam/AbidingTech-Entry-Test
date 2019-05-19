import { Routes, RouterModule } from '@angular/router';
import { DiscountCodeComponent } from './discount-code.component';

const routes: Routes = [
  {
    path: '', component: DiscountCodeComponent, children: [
      { path: '', loadChildren: './discount-code-list/discount-code-list.module#DiscountCodeListModule' },
      { path: 'add', loadChildren: './discount-code-data/discount-code-data.module#DiscountCodeDataModule' },
      { path: 'edit/:id', loadChildren: './discount-code-data/discount-code-data.module#DiscountCodeDataModule' }
    ]
  },
];

export const DiscountCodeRoutes = RouterModule.forChild(routes);
