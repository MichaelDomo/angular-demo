import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from "@angular/core";
import {UrlService} from "../services/url.service";
import {HeadersService} from "../services/headers.service";

@Injectable()
export class MarketService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('parser');
    }

    public get(): Promise<any> {
        return this.http.get(this.url, {headers: this.headers})
            .toPromise()
            .then(this.extractData);
    }

    private extractData(res: Response) {
        return res.json() || {};
    }
}
