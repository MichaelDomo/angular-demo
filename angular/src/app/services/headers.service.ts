import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';

@Injectable()
export class HeadersService {
    public static getHeaders() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer DIba-D8fniiSXWDaEMmhl3BSKKwiht64');
        return headers;
    }
}