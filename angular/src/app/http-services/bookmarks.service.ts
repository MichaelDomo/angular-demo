import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Bookmark} from "../entities/bookmark";
import {Injectable} from "@angular/core";
import {UrlService} from "../services/url.service";
import {HeadersService} from "../services/headers.service";
import {BookmarkModel} from "../models/bookmark.model";
import {HandleError} from "../services/handle-error.service";

@Injectable()
export class BookmarksService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('user-bookmark');
    }

    public getAll(): Promise<Bookmark[]> {
        return this.http.get(this.url, {headers: this.headers})
            .toPromise()
            .then(maps)
            .catch(HandleError.handleError);
    }

    public getByUrl(url: string): Promise<Bookmark> {
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(map)
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

    public add(body: BookmarkModel): Promise<Bookmark> | any {
        let url = `${this.url}/create`;
        return this.http.put(url, body, {headers: HeadersService.getHeaders()})
            .toPromise()
            .then(data => {
                return this.getByUrl(data.json().location[0]);
            })
            .catch(HandleError.handleError);
    }
}

function toType(r: any): Bookmark {
    return <Bookmark>({
        id: r.id,
        project: r.project,
        hideDescription: false
    });
}

function maps(response: Response): Bookmark[] {
    return response.json().map(toType)
}

function map(response: Response): Bookmark {
    return toType(response.json());
}
