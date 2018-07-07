import {Component, OnInit} from '@angular/core';
import {Currency} from "../entities/currency";
import {NgForm} from "@angular/forms";
import 'rxjs/add/operator/toPromise';
import {UpdateService} from "../services/update.service";
import {LoaderService} from "../services/loader.service";
import {SettingsService} from "../http-services/settings.service";
import {UserService} from "../http-services/user.service";
import {User} from "../entities/user";
import {Market} from "../entities/market";
import {CurrencyService} from "../http-services/currency.service";
import {MarketService} from "../http-services/market.service";
import {FilterModel} from "../models/filter.model";
import {SettingsModel} from "../models/settings.model";
import {SettingsCreateModel} from "../models/settings-create.model";
import {BuildModelService} from "../services/build-model.service";
import {FilterService} from "../http-services/filter.service";
import {UserModel} from "../models/user.model";
import {LangsModel} from "../models/langs.models";

@Component({
    selector: 'app-form',
    templateUrl: '../angular/src/app/form/form.component.html'
})

export class FormComponent implements OnInit {
    public langs = new LangsModel(true, true);

    public hide: boolean = true;
    public loaded: boolean = false;
    public settingsSelectOpen: boolean;

    public errorMessage: string;
    public filtersErrorMessage: string;
    public settingsErrorMessage: string;
    public addSettingsErrorMessage: string;

    public user: User;
    public currencies: Currency[];
    public markets: Market[] | any;

    public filterCreateModel = new FilterModel(null);
    public settingsCreateModel = new SettingsCreateModel(null);
    public settingsUpdateModel: SettingsModel;

    public constructor(
        private userService: UserService,
        private currencyService: CurrencyService,
        private marketService: MarketService,
        private settingsService: SettingsService,
        private buildModelService: BuildModelService,
        private loaderService: LoaderService,
        private updateService: UpdateService,
        private filterService: FilterService
    ) { }

    public ngOnInit() {
        this.userService.get().then(
            result => {
                this.currencyService.get().then(result => this.currencies = result);
                this.marketService.get().then(result => {
                    this.markets = result;
                    this.updateSelectAll();
                });
                this.user = result;
                this.settingsUpdateModel = this.buildModelService.buildSettingsUpdateModel(this.user.settings);
                this.loaded = true;
            },
            error => {
                this.errorMessage = error;
                this.loaderService.displayLoader(false);
            }
        );
    }

    private updateSelectAll() {
        let newLangs = this.langs;
        for (let lang in newLangs) {
            newLangs[lang] = true;
        }
        for (let lang in this.markets) {
            for (let type in this.markets[lang]) {
                for (let market in this.markets[lang][type]) {
                    let marketObj = this.markets[lang][type][market];
                    if (this.settingsUpdateModel.parsers[marketObj.value] !== true) {
                        newLangs[marketObj.lang] = false;
                    }
                }
            }
        }
        this.langs = newLangs;
    }

    public changeSettingsList(id: number) {
        this.loaderService.displayLoader(true);
        this.addSettingsErrorMessage = null;
        this.userService.save(new UserModel(id)).then(
            result => {
                this.user = result;
                this.settingsUpdateModel = this.buildModelService.buildSettingsUpdateModel(this.user.settings);
                this.updateService.changeSettings('1');
                this.updateSelectAll();
            },
            error => {
                this.errorMessage = error;
                this.loaderService.displayLoader(false);
            }
        );
    }

    public removeSettings(id: number) {
        this.addSettingsErrorMessage = null;
        this.settingsService.remove(id).then(
            result => {
                if (result.json() === 1) {
                    this.user.allSettings = this.user.allSettings.filter(item => item.id !== id);
                }
            },
            error => this.addSettingsErrorMessage = error
        );
    }

    public addAllFilters() {
        this.filtersErrorMessage = null;
        this.loaderService.displayLoader(true);
        for (let key of this.filterCreateModel.value.split(',')) {
            this.addFilter(key);
        }
        this.updateService.changeSettings('1');
    }

    public addFilter(value: string) {
        if (value.trim() !== '') {
            this.filterService.add(new FilterModel(value)).then(
                result => this.user.filters.push(result),
                error => this.filtersErrorMessage = error
            );
        }
    }

    public addSettings() {
        this.addSettingsErrorMessage = null;
        this.settingsService.add(this.settingsCreateModel).then(
            result => this.user.allSettings.push(result),
            error => this.addSettingsErrorMessage = error
        );
    }

    public saveSettings(form: NgForm) {
        this.loaderService.displayLoader(true);
        this.settingsErrorMessage = null;
        for (let parser in form.value.parsers) {
            if (form.value.parsers[parser] !== true) {
                delete form.value.parsers[parser];
            }
        }
        this.settingsUpdateModel.parsers = form.value.parsers;
        this.settingsService.save(this.settingsUpdateModel).then(
            result => {
                this.updateService.changeSettings('1');
                this.updateSelectAll();
            },
            error => {
                this.settingsErrorMessage = error;
                this.loaderService.displayLoader(false);
            }
        );
    }

    public removeFilter(id: number) {
        this.loaderService.displayLoader(true);
        this.filtersErrorMessage = null;
        this.filterService.remove(id).then(
            result => {
                if (result === 1) {
                    this.user.filters = this.user.filters.filter(item => item.id !== id);
                    this.updateService.changeSettings('1');
                }
            },
            error => {
                this.filtersErrorMessage = error;
                this.loaderService.displayLoader(false);
            }
        );
    }

    public toggleParsers(lang: string, form: NgForm, checked: boolean) {
        for (let parsers in this.markets[lang]) {
            for (let parser of this.markets[lang][parsers]) {
                form.value.parsers[parser.value] = checked;
            }
        }
        this.saveSettings(form);
    }

    public toggle() {
        this.hide = !this.hide;
    }
}
