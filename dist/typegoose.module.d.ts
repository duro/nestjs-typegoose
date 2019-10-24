import { DynamicModule } from '@nestjs/common';
import { TypegooseClassWithOptions } from './typegoose.providers';
import { TypegooseClass } from './typegoose-class.interface';
import { TypegooseModuleAsyncOptions, TypegooseConnectionOptions } from './typegoose-options.interface';
export declare class TypegooseModule {
    static forRoot(uri: string, options?: TypegooseConnectionOptions): DynamicModule;
    static forRootAsync(options: TypegooseModuleAsyncOptions): DynamicModule;
    static forFeature(models: (TypegooseClass | TypegooseClassWithOptions)[], connectionName?: string): DynamicModule;
}