import {OrderItem} from "./order-item";

export const statusMap: Map<string,string> = new Map([
    ['done', 'выполнен'],
    ['created', 'создан'],
    ['pending', 'готовится'],
    ]);

export interface Order {
    id?: string;
    _id?: string;
    number?: number;
    status?: string;
    name?: string;
    items?: OrderItem[];
    ingredients?: string[];
    createdAt?: string;
    updatedAt?: string;
}

