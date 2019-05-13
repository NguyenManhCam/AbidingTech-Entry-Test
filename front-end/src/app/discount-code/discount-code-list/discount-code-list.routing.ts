import { Routes, RouterModule } from '@angular/router';
import { DiscountCodeListComponent } from './discount-code-list.component';

const routes: Routes = [
  { path: '', component: DiscountCodeListComponent },
];

export const DiscountCodeListRoutes = RouterModule.forChild(routes);
