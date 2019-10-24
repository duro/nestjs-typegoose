"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_module_1 = require("./typegoose.module");
const typegoose_core_module_1 = require("./typegoose-core.module");
const typegoose_1 = require("@typegoose/typegoose");
const createProviders = require("./typegoose.providers");
class MockTask {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], MockTask.prototype, "description", void 0);
class MockUser {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], MockUser.prototype, "name", void 0);
describe('TypegooseModule', () => {
    describe('forRoot', () => {
        it('should call global CoreModule forRoot', () => {
            jest.spyOn(typegoose_core_module_1.TypegooseCoreModule, 'forRoot').mockImplementation(() => ({
                providers: 'DbConnection'
            }));
            const module = typegoose_module_1.TypegooseModule.forRoot('mongourl', { db: 'db settings' });
            expect(module).toEqual({
                module: typegoose_module_1.TypegooseModule,
                imports: [
                    {
                        providers: 'DbConnection'
                    }
                ]
            });
            expect(typegoose_core_module_1.TypegooseCoreModule.forRoot).toHaveBeenCalledWith('mongourl', { db: 'db settings' });
        });
        it('should call global CoreModule forRoot with empty config', () => {
            jest.spyOn(typegoose_core_module_1.TypegooseCoreModule, 'forRoot').mockImplementation(() => ({
                providers: 'DbConnection'
            }));
            typegoose_module_1.TypegooseModule.forRoot('mongourl');
            expect(typegoose_core_module_1.TypegooseCoreModule.forRoot).toHaveBeenCalledWith('mongourl', {});
        });
    });
    describe('forRootAsync', () => {
        it('should call global CoreModule forRoot', () => {
            jest.spyOn(typegoose_core_module_1.TypegooseCoreModule, 'forRootAsync').mockImplementation(() => ({
                providers: 'DbConnection'
            }));
            const options = {
                useFactory: () => {
                    return {
                        uri: 'mongourl',
                        db: 'db settings'
                    };
                }
            };
            const module = typegoose_module_1.TypegooseModule.forRootAsync(options);
            expect(module).toEqual({
                module: typegoose_module_1.TypegooseModule,
                imports: [
                    {
                        providers: 'DbConnection'
                    }
                ]
            });
            expect(typegoose_core_module_1.TypegooseCoreModule.forRootAsync).toHaveBeenCalledWith(options);
        });
    });
    describe('forFeature', () => {
        let models, convertedModels;
        beforeEach(() => {
            models = [
                MockTask,
                {
                    typegooseClass: MockUser,
                    schemaOptions: {
                        collection: 'differentCollectionNameUser'
                    }
                }
            ];
            let count = -1;
            convertedModels = [
                'convertedTask',
                'convertedUser'
            ];
            jest.spyOn(createProviders, 'convertToTypegooseClassWithOptions')
                .mockImplementation(() => {
                count += 1;
                return convertedModels[count];
            });
            jest.spyOn(createProviders, 'createTypegooseProviders')
                .mockReturnValue('createdProviders');
        });
        it('should return module that exports providers for models', () => {
            const module = typegoose_module_1.TypegooseModule.forFeature(models);
            const expectedProviders = 'createdProviders';
            expect(createProviders.convertToTypegooseClassWithOptions).toHaveBeenCalledWith(MockTask);
            expect(createProviders.convertToTypegooseClassWithOptions).toHaveBeenCalledWith({
                typegooseClass: MockUser,
                schemaOptions: {
                    collection: 'differentCollectionNameUser'
                }
            });
            expect(createProviders.createTypegooseProviders).toHaveBeenCalledWith(undefined, convertedModels);
            expect(module).toEqual({
                module: typegoose_module_1.TypegooseModule,
                providers: expectedProviders,
                exports: expectedProviders
            });
        });
        it('should return module that createdTypegooseProviders with provided connectionName', () => {
            const connectionName = 'OtherMongoDB';
            const module = typegoose_module_1.TypegooseModule.forFeature(models, connectionName);
            expect(createProviders.createTypegooseProviders).toHaveBeenCalledWith(connectionName, convertedModels);
        });
    });
});
