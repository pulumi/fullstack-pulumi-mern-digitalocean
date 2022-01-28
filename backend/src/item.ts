export interface BaseItem {
    name: string;
    price: number;
    description: string;
    image: string;
}

export interface Item extends BaseItem {
    id: number;
}
