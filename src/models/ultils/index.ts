
import mongoose, { Model } from 'mongoose';
import { find, isEqual } from "lodash";
import allModels from "..";
import { ModelType } from './index.d';

const ALL_CREATED_MODELS: any = {};

let models: Array<ModelType> = [];

const setModels = () => {
    models = allModels
}

const getModelSchema = (modelName:string) => {
    return find(models, { "name": modelName })?.schema
}

const createModel = (modelName: string): Model<any> => {
    if (ALL_CREATED_MODELS[modelName]) return ALL_CREATED_MODELS[modelName];
    // Tạo schema
    const modelSchema = getModelSchema(modelName)

    const SCHEMA = new mongoose.Schema(modelSchema, { timestamps: true });
    // Tạo model
    const Model = mongoose.model(modelName, SCHEMA);
    // Lưu vào biến ALL_CREATED_MODELS
    // Để lần sau khỏi phải khởi tạo lại
    ALL_CREATED_MODELS[modelName] = Model;
    return Model;
};

const getModel = (modelName:string) => {
    let Model: Model<any>;
    (models as Array<ModelType>).map((model: ModelType) => {
        if (isEqual(model?.name, modelName)) {
            Model = createModel(model?.name);
        }
    });
    return Model;
}

export {
    setModels,
    getModel
}