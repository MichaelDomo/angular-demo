import {Parser} from "./parser";
export interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
    date: string;
    time: string;
    price: number;
    currency: string;
    hideDescription: boolean;
    isBookmark: boolean;
    parser: Parser;
}
