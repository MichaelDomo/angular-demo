import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Filter} from "../entities/filter";
import {Injectable} from "@angular/core";
import {UrlService} from "../services/url.service";
import {HeadersService} from "../services/headers.service";
import {FilterModel} from "../models/filter.model";
import {HandleError} from "../services/handle-error.service";

@Injectable()
export class FilterService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('user-filter');
    }

    public getByUrl(url: string): Promise<Filter> {
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(mapFilter)
            .catch(HandleError.handleError);
    }

    public remove(id: number): Promise<any> {
        let url = `${this.url}/delete/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(data => {
                return data.json();
            })
            .catch(HandleError.handleError);
    }

    public add(body: FilterModel): Promise<Filter> {
        let url = `${this.url}/create`;
        return this.http.put(url, body, {headers: HeadersService.getHeaders()})
            .toPromise()
            .then(data => {
                return this.getByUrl(data.json().location[0]);
            }).catch(HandleError.handleError);
    }
}

function toFilter(r: any): Filter {
    return <Filter>({
        id: r.id,
        value: r.value,
    });
}

function mapFilter(response: Response): Filter {
    return toFilter(response.json());
}
