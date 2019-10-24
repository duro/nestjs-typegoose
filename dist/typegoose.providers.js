"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_utils_1 = require("./typegoose.utils");
const typegoose_1 = require("@typegoose/typegoose");
const isClass = require("is-class");
exports.isTypegooseClassWithOptions = (item) => isClass(item.typegooseClass);
exports.convertToTypegooseClassWithOptions = (item) => {
    if (isClass(item)) {
        return {
            typegooseClass: item
        };
    }
    else if (exports.isTypegooseClassWithOptions(item)) {
        return item;
    }
    throw new Error('Invalid model object');
};
function createTypegooseProviders(connectionName, models = []) {
    return models.map(({ typegooseClass, schemaOptions = {} }) => ({
        provide: typegoose_utils_1.getModelToken(typegooseClass.name),
        useFactory: (connection) => typegoose_1.getModelForClass(typegooseClass, {
            existingConnection: connection,
            schemaOptions
        }),
        inject: [typegoose_utils_1.getConnectionToken(connectionName)]
    }));
}
exports.createTypegooseProviders = createTypegooseProviders;
