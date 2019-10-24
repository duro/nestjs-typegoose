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
const typegoose_1 = require("@typegoose/typegoose");
const typegoose_providers_1 = require("./typegoose.providers");
const mongoose = require("mongoose");
const typegoose = require("@typegoose/typegoose");
const mockgoose_1 = require("mockgoose");
const typegoose_constants_1 = require("./typegoose.constants");
var any = jasmine.any;
const mockgoose = new mockgoose_1.Mockgoose(mongoose);
class MockUser {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], MockUser.prototype, "name", void 0);
class MockTask {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], MockTask.prototype, "description", void 0);
describe('createTypegooseProviders', () => {
    let connection;
    beforeAll(async () => {
        jest.setTimeout(120000);
        await mockgoose.prepareStorage();
        connection = await mongoose.createConnection('mongodb://foobar/baz');
        setTimeout(() => {
            connection.close(err => {
                if (err)
                    return console.log(err);
                console.log('disconnected');
            });
        }, 60000);
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    describe('setModelForClass', () => {
        let mockSetModel, MockTypegooseClass, mockConnection, schemaOptions, provider;
        beforeEach(() => {
            mockSetModel = jest.spyOn(typegoose, 'getModelForClass').mockImplementation(() => jest.fn());
            MockTypegooseClass = jest.fn();
            mockConnection = jest.fn();
            schemaOptions = {
                collection: 'newCollectionName'
            };
            const models = [
                {
                    typegooseClass: MockTypegooseClass,
                    schemaOptions
                }
            ];
            ([provider] = typegoose_providers_1.createTypegooseProviders(typegoose_constants_1.DEFAULT_DB_CONNECTION_NAME, models));
            provider.useFactory(mockConnection);
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should setup the database model', () => {
            expect(mockSetModel).toHaveBeenCalled();
        });
        it('should use existing connection from DbConnectionToken', () => {
            expect(mockSetModel.mock.calls[0][1]).toEqual(expect.objectContaining({
                existingConnection: mockConnection
            }));
        });
        it('should forward schema options to typegoose', () => {
            expect(mockSetModel.mock.calls[0][1]).toEqual(expect.objectContaining({
                schemaOptions
            }));
        });
    });
    it('should create typegoose providers from models', () => {
        jest.setTimeout(30000);
        const models = [
            {
                typegooseClass: MockUser
            },
            {
                typegooseClass: MockTask
            }
        ];
        const providers = typegoose_providers_1.createTypegooseProviders(typegoose_constants_1.DEFAULT_DB_CONNECTION_NAME, models);
        expect(providers).toEqual([
            {
                provide: 'MockUserModel',
                useFactory: any(Function),
                inject: [typegoose_constants_1.DEFAULT_DB_CONNECTION_NAME]
            },
            {
                provide: 'MockTaskModel',
                useFactory: any(Function),
                inject: [typegoose_constants_1.DEFAULT_DB_CONNECTION_NAME]
            }
        ]);
        const userProvider = providers[0];
        const model = userProvider.useFactory(connection);
        expect(model.prototype.model).toBeTruthy();
    }, 15000);
    it('should create no providers if no models are given', () => {
        const providers = typegoose_providers_1.createTypegooseProviders(typegoose_constants_1.DEFAULT_DB_CONNECTION_NAME);
        expect(providers).toEqual([]);
    });
    afterAll(() => {
        connection.close();
    });
});
class MockTypegooseClass {
}
describe('convertToTypegooseClassWithOptions', () => {
    it('returns model as typegooseClass if it is just a class', () => {
        expect(typegoose_providers_1.convertToTypegooseClassWithOptions(MockTypegooseClass)).toEqual({
            typegooseClass: MockTypegooseClass
        });
    });
    it('returns model and schemaOptions if it is a TypegooseClassWithOptions', () => {
        const options = {
            collection: 'differentName'
        };
        const expected = {
            typegooseClass: MockTypegooseClass,
            schemaOptions: options
        };
        expect(typegoose_providers_1.convertToTypegooseClassWithOptions(expected)).toEqual(expected);
    });
    it('throws error is not a class or not a TypegooseClassWithOptions', () => {
        const handler = () => {
            expect(typegoose_providers_1.convertToTypegooseClassWithOptions({
                something: 'different'
            }));
        };
        expect(handler).toThrowErrorMatchingSnapshot();
    });
});
