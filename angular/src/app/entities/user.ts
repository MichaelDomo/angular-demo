import {Settings} from "./settings";
import {Bookmark} from "./bookmark";
import {Filter} from "./filter";
export interface User {
    id: number;
    settingsId: number;
    settings: Settings;
    bookmarks: Bookmark[];
    filters: Filter[];
    allSettings: Settings[];
    isPro: boolean;
    isAdmin: boolean;
}