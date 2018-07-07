import {Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from "@angular/core";

@Injectable()
export class HandleError {
    public static handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || body;
            if (typeof err === 'object' && err.length > 0) {
                errMsg = err[0].message;
            } else if (typeof err === 'object' && err.message !== undefined) {
                errMsg = err.message;
            } else {
                errMsg = err;
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Promise.reject(errMsg);
    }
}