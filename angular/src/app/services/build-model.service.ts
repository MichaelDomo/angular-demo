import {Injectable} from '@angular/core';
import {SettingsModel} from "../models/settings.model";
import {Settings} from "../entities/settings";

@Injectable()
export class BuildModelService {
    public buildSettingsUpdateModel(model: Settings): SettingsModel {
        return new SettingsModel(
            model.name,
            model.currency,
            model.valueFrom,
            model.valueTo,
            model.showPrice,
            model.searchTitle,
            model.searchDescription,
            model.showDescription,
            model.soundNotification,
            model.parsers
        );
    }
}