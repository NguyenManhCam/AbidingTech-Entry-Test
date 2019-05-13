import { Routes, RouterModule } from '@angular/router';
import { DiscountCodeDataComponent } from './discount-code-data.component';

const routes: Routes = [
  { path: '', component: DiscountCodeDataComponent },
];

export const DiscountCodeDataRoutes = RouterModule.forChild(routes);
