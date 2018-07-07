import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from "@angular/core";
import {Settings} from "../entities/settings";
import {UrlService} from "../services/url.service";
import {SettingsCreateModel} from "../models/settings-create.model";
import {SettingsModel} from "../models/settings.model";
import {HeadersService} from "../services/headers.service";
import {HandleError} from "../services/handle-error.service";

@Injectable()
export class SettingsService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('user-settings');
    }

    public getByUrl(url): Promise<Settings> {
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(mapSettings)
            .catch(HandleError.handleError);
    }

    public get(): Promise<Settings> {
        return this.http.get(this.url + '/view', {headers: this.headers})
            .toPromise()
            .then(mapSettings)
            .catch(HandleError.handleError);
    }

    public remove(id: number): Promise<any> {
        return this.http.delete(this.url + '/delete/' + id, {headers: this.headers})
            .toPromise()
            .catch(HandleError.handleError);
    }

    public add(model: SettingsCreateModel): Promise<Settings> {
        return this.http.post(this.url + '/create', model, {headers: this.headers})
            .toPromise()
            .then(result => {
                return this.getByUrl(result.json().location[0]);
            })
            .catch(HandleError.handleError);
    }

    public save(model: SettingsModel): Promise<any> {
        return this.http.post(this.url + '/update', model, {headers: this.headers})
            .toPromise()
            .catch(HandleError.handleError);
    }
}

function toSettings(r: any): Settings {
    return <Settings>({
        id: r.id,
        name: r.name,
        description: r.description,
        currency: r.currency,
        valueFrom: r.currency_value_from,
        valueTo: r.currency_value_to,
        showPrice: r.show_price,
        searchTitle: r.search_title,
        searchDescription: r.search_description,
        parsers: r.parsers,
        soundNotification: r.sound_notification,
        showDescription: r.show_description
    })
}

function mapSettings(response: Response): Settings {
    return toSettings(response.json());
}
