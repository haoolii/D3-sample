import { Data } from './Data';
export interface Config {
    els: string;
    width: number;
    height: number;
    padding: number;
    dataSource: Array<Data[]>
}