import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from "@angular/core";
import {User} from "../entities/user";
import {HeadersService} from "../services/headers.service";
import {UrlService} from "../services/url.service";
import {UserModel} from "../models/user.model";
import {HandleError} from "../services/handle-error.service";
import {Settings} from "../entities/settings";
import {Bookmark} from "../entities/bookmark";
import {Filter} from "../entities/filter";

@Injectable()
export class UserService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('profile');
    }

    public get(): Promise<User> {
        return this.http.get(this.url, {headers: this.headers})
            .toPromise()
            .then(mapUser)
            .catch(HandleError.handleError);
    }

    public save(model: UserModel): Promise<User> {
        return this.http.post(this.url + '/update', model, {headers: this.headers})
            .toPromise()
            .then(mapUser)
            .catch(HandleError.handleError);
    }
}

function toUser(r: any): User {
    return <User>({
        id: r.id,
        settingsId: r.settings_id,
        settings: <Settings>({
            id: r.settings.id,
            name: r.settings.name,
            description: r.settings.description,
            currency: r.settings.currency,
            valueFrom: r.settings.currency_value_from,
            valueTo: r.settings.currency_value_to,
            showPrice: r.settings.show_price,
            searchTitle: r.settings.search_title,
            searchDescription: r.settings.search_description,
            parsers: r.settings.parsers,
            soundNotification: r.settings.sound_notification,
            showDescription: r.settings.show_description
        }),
        filters: <Filter[]> r.settings.filters,
        bookmarks: <Bookmark[]> r.bookmarks,
        allSettings: <Settings[]> r.settingsList
    });
}

function mapUser(response: Response): User {
    return toUser(response.json());
}

