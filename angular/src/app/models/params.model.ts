export class ParamsModel {
    constructor(public id: number,
                public searchBefore: number,
                public searchAfter: number ,
                public lastId: number | null = null,
                public limit: number = 20) {
    }
}
