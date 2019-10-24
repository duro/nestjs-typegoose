import { TypegooseClass } from './typegoose-class.interface';
import { Connection, SchemaOptions } from 'mongoose';
export declare type TypegooseClassWithOptions = {
    typegooseClass: TypegooseClass;
    schemaOptions?: SchemaOptions;
};
export declare const isTypegooseClassWithOptions: (item: any) => item is TypegooseClassWithOptions;
export declare const convertToTypegooseClassWithOptions: (item: TypegooseClass | TypegooseClassWithOptions) => TypegooseClassWithOptions;
export declare function createTypegooseProviders(connectionName: string, models?: TypegooseClassWithOptions[]): {
    provide: string;
    useFactory: (connection: Connection) => any;
    inject: string[];
}[];