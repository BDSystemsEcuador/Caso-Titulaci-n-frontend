import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

// Application Modules
import {AppRouting} from './app-routing';
import {AppCodeModule} from './shared/components/code/app.code.component';
import {NgxSpinnerModule} from 'ngx-spinner';

// PrimeNg Modules
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {PasswordModule} from 'primeng/password';

// Components
import {AppComponent} from './app.component';
import {AppMainComponent} from './shared/components/main/app.main.component';
import {AppMenuComponent} from './shared/components/menu/app.menu.component';
import {AppMenuitemComponent} from './shared/components/menu/app.menuitem.component';
import {AppBreadcrumbComponent} from './shared/components/breadcrumb/app.breadcrumb.component';
import {AppConfigComponent} from './shared/components/config/app.config.component';
import {AppRightPanelComponent} from './shared/components/rightpanel/app.rightpanel.component';
import {AppTopBarComponent} from './shared/components/topbar/app.topbar.component';
import {AppFooterComponent} from './shared/components/footer/app.footer.component';
import {AppBlankComponent} from './shared/components/blank/app.blank.component';

// Services
import {BreadcrumbService} from './shared/services/breadcrumb.service';
import {InterceptorService} from './interceptors/interceptor.service';
import {MenuService} from './shared/services/app.menu.service';
import {SharedModule} from './pages/shared/shared.module';
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRouting,
        AppCodeModule,
        HttpClientModule,
        NgxSpinnerModule,
        SharedModule,
        // Primeng Modules
        CalendarModule,
        CheckboxModule,
        RadioButtonModule,
        InputSwitchModule,
        PasswordModule,
    ],
    declarations: [
        AppBlankComponent,
        AppBreadcrumbComponent,
        AppComponent,
        AppConfigComponent,
        AppFooterComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppRightPanelComponent,
        AppTopBarComponent,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        MenuService,
        BreadcrumbService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
