import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from "@angular/core";
import {UrlService} from "../services/url.service";
import {HeadersService} from "../services/headers.service";
import {Currency} from "../entities/currency";

@Injectable()
export class CurrencyService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('currency');
    }

    public get(): Promise<Currency[]> {
        return this.http.get(this.url, {headers: this.headers})
            .toPromise()
            .then(map);
    }
}

function toEntity(r: any): Currency {
    return <Currency>({
        value: r.value,
        desc: r.desc,
    });
}

function map(response: Response): Currency[] {
    return response.json().map(toEntity);
}
