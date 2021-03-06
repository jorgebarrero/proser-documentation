import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";

import { AuthGuard } from "shared/guards";
import { AlertService } from "shared/services/helpers/alert.service";
import { AlertModule } from "shared/modules/alert/alert.module";
import { NowModule } from "shared/modules/now/now.module";
import { ConnectionModule } from "shared/modules/connection/connection.module";
import { SelectorModule } from "shared/modules/selector/selector.module";
import { EnvServiceProvider } from "shared/services/helpers/env.service.provider";

import { AppRoutingModule } from "./app-routing.module";

import { HeaderMenuModule } from "shared/modules/header-menu/header-menu.module";
import { HeaderMenuUserModule } from "shared/modules/header-menu-user/header-menu-user.module";
import { HeaderMenuBrandModule } from "shared/modules/header-menu-brand/header-menu-brand.module";
import { IntroPageModule } from "shared/modules/intro-page/intro-page.module";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./home/header/header.component";

import { HeaderMenuLoginComponent } from "./home/header/header-menu-login/header-menu-login.component";
import { HeaderMenuUserComponent } from "./home/header/header-menu-user/header-menu-user.component";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    HeaderMenuLoginComponent,
    HeaderMenuUserComponent
  ],
  imports: [
    BrowserModule,
    SelectorModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AlertModule,
    NowModule,
    NgbModule,
    ConnectionModule,

    HeaderMenuModule,
    HeaderMenuUserModule,
    HeaderMenuBrandModule,
    IntroPageModule,

    BsDropdownModule,
    CollapseModule,

    FontAwesomeModule,

    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),

    AppRoutingModule
  ],
  providers: [
    EnvServiceProvider,
    AuthGuard,
    AlertService
    // {
    //   provide: externalUrlProvider,
    //   useValue: (route: ActivatedRouteSnapshot) => {
    //     const externalUrl = route.paramMap.get("externalUrl");
    //     window.open(externalUrl, "_self");
    //   }
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

const providers = [];
@NgModule({})
export class UserSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: providers
    };
  }
}
