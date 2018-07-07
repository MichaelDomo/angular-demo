import {BrowserModule} from '@angular/platform-browser';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NgModule} from '@angular/core';
import {NglModule} from 'ng-lightning';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {AppComponent} from './app.component';
import {ObjNgFor} from "./services/keys.pipe";
import {UrlService} from "./services/url.service";
import {HandleError} from "./services/handle-error.service";
import {UpdateService} from "./services/update.service";
import {LoaderService} from "./services/loader.service";
import {FormComponent} from "./form/form.component";
import {FilterService} from "./http-services/filter.service";
import {SettingsService} from "./http-services/settings.service";
import {BookmarksService} from "./http-services/bookmarks.service";
import {ProjectsService} from "./http-services/projects.service";
import {CurrencyService} from "./http-services/currency.service";
import {MarketService} from "./http-services/market.service";
import {UserService} from "./http-services/user.service";
import {BuildModelService} from "./services/build-model.service";
import {ResultComponent} from "./result/result.component";
import {ScrollComponent} from "./scroll/scroll.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NglModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: Http) => new TranslateHttpLoader(http, "../angular/src/i18n/", ".json"),
                deps: [Http]
            }
        })
    ],
    declarations: [
        AppComponent,
        FormComponent,
        ResultComponent,
        ScrollComponent,
        ObjNgFor
    ],
    providers: [
        UpdateService,
        LoaderService,
        UrlService,
        HandleError,
        BuildModelService,
        BookmarksService,
        ProjectsService,
        SettingsService,
        MarketService,
        CurrencyService,
        UserService,
        FilterService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
