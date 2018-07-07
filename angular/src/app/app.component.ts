import {Component, OnInit} from '@angular/core';
import {LoaderService} from "./services/loader.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    templateUrl: '../angular/src/app/app.component.html'
})
export class AppComponent implements OnInit {
    objLoaderStatus: boolean;

    constructor(private loaderService: LoaderService, translate: TranslateService) {
        translate.setDefaultLang('en-US');
        translate.use(document.documentElement.lang);
        this.objLoaderStatus = false;
    }

    ngOnInit() {
        this.loaderService.loaderStatus.subscribe((val: boolean) => {
            this.objLoaderStatus = val;
        });
        this.loaderService.displayLoader(true);
    }
}
