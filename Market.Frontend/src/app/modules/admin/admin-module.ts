import {NgModule} from '@angular/core';

import {AdminRoutingModule} from './admin-routing-module';
import {ProductsComponent} from './catalogs/products/products.component';
import {ProductsAddComponent} from './catalogs/products/products-add/products-add.component';
import {ProductsEditComponent} from './catalogs/products/products-edit/products-edit.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {ProductCategoriesComponent} from './catalogs/product-categories/product-categories.component';
import {EventCategoriesComponent} from './catalogs/event-categories/event-categories.component';
import {EventCategoryUpsertComponent} from './catalogs/event-categories/event-category-upsert/event-category-upsert.component';
import {SeatCategoriesComponent} from './catalogs/seat-categories/seat-categories.component';
import {SeatCategoryUpsertComponent} from './catalogs/seat-categories/seat-category-upsert/seat-category-upsert.component';
import {CitiesComponent} from './catalogs/cities/cities.component';
import {CityUpsertComponent} from './catalogs/cities/city-upsert/city-upsert.component';
import {VenuesComponent} from './catalogs/venues/venues.component';
import {VenueUpsertComponent} from './catalogs/venues/venue-upsert/venue-upsert.component';
import {
  ProductCategoryUpsertComponent
} from './catalogs/product-categories/product-category-upsert/product-category-upsert.component';
import {AdminOrdersComponent} from './orders/admin-orders.component';
import {SharedModule} from '../shared/shared-module';
import {AccountModule} from '../account/account-module';
import { OrderDetailsDialogComponent } from './orders/admin-orders-details-dialog/order-details-dialog.component';
import { ChangeStatusDialogComponent } from './orders/change-status-dialog/change-status-dialog.component';
import { ProductImageComponent } from './catalogs/products/product-image/product-image.component';
import { PromotionsComponent } from './catalogs/promotions/promotions.component';
import { PromotionUpsertComponent } from './catalogs/promotions/promotion-upsert/promotion-upsert.component';
import { OrderEditComponent } from './orders/order-edit/order-edit.component';
import { ProductAutocompleteComponent } from './orders/order-edit/product-autocomplete/product-autocomplete.component';
import { ExchangeRatesComponent } from './finance/exchange-rates/exchange-rates.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsAddComponent,
    ProductsEditComponent,
    AdminLayoutComponent,
    ProductCategoriesComponent,
    ProductCategoryUpsertComponent,
    EventCategoriesComponent,
    EventCategoryUpsertComponent,
    SeatCategoriesComponent,
    SeatCategoryUpsertComponent,
    CitiesComponent,
    CityUpsertComponent,
    VenuesComponent,
    VenueUpsertComponent,
    AdminOrdersComponent,
    OrderDetailsDialogComponent,
    ChangeStatusDialogComponent,
    ProductImageComponent,
    PromotionsComponent,
    PromotionUpsertComponent,
    OrderEditComponent,
    ProductAutocompleteComponent,
    ExchangeRatesComponent,
    AdminSettingsComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    // "Moj profil" (/admin/profile) – ista stranica kao /client/profile
    AccountModule,
  ]
})
export class AdminModule { }
