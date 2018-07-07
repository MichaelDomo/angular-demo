export class SettingsModel {
    constructor(
        public name: string,
        public currency: string,
        public valueFrom: number,
        public valueTo: number,
        public showPrice: string,
        public searchTitle: string,
        public searchDescription: string,
        public showDescription: number,
        public soundNotification: number,
        public parsers: any
    ) { }
}
