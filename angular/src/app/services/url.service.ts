import {Injectable} from '@angular/core';

@Injectable()
export class UrlService {
    public buildUrl(url: string) {
        return './api/v1/' + url;
    }
}