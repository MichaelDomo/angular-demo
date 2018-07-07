import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from "@angular/core";
import {UrlService} from "../services/url.service";
import {HeadersService} from "../services/headers.service";
import {Project} from "../entities/project";
import {ParamsModel} from "../models/params.model";
import {HandleError} from "../services/handle-error.service";

@Injectable()
export class ProjectsService {
    private headers: Headers;
    private url: string;

    constructor(private http: Http, private urlService: UrlService) {
        this.headers = HeadersService.getHeaders();
        this.url = this.urlService.buildUrl('project/search');
    }

    public get(): Promise<Project[]> {
        return this.http.post(this.url, {}, {headers: this.headers})
            .toPromise()
            .then(mapProjects)
            .catch(HandleError.handleError);
    }

    public getPrev($id: number): Promise<Project[]> {
        let params = new ParamsModel($id, 1, 0);
        return this.http.post(this.url, params, {headers: this.headers})
            .toPromise()
            .then(mapProjects)
            .catch(HandleError.handleError);
    }

    public getNext($id: number): Promise<Project[]> {
        let params = new ParamsModel($id, 0, 1);
        return this.http.post(this.url, params, {headers: this.headers})
            .toPromise()
            .then(mapProjects)
            .catch(HandleError.handleError);
    }
}

function toProject(r: any): Project {
    return <Project>({
        id: r.id,
        title: r.title,
        description: r.description,
        link: r.link,
        date: r.date,
        time: r.time,
        price: r.price,
        currency: r.currency,
        parser: r.parser,
        isBookmark: r.isBookmark,
        hideDescription: true
    });
}

function mapProjects(response: Response): Project[] {
    return response.json().map(toProject);
}
