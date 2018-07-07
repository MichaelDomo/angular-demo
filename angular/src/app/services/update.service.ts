import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class UpdateService {
    private settingsSource = new Subject<string>();
    settingsObserver$ = this.settingsSource.asObservable();

    changeSettings(id) {
        this.settingsSource.next(id);
    }
}
