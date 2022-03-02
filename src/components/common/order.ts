import {OrderItem} from "./order-item";

export interface Order {
    id: string;
    status?: string;
    name?: string;
    items?: OrderItem[];
}

