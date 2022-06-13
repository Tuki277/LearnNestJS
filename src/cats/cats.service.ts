import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentDefinition, FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Cat, CatDocument } from "./schema/cat.schema";

@Injectable()
export class CatsService {
  constructor (@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}
  
  async getCats(): Promise<Cat[]> {
    return await this.catModel.find({});
  }

  async createCats(input: DocumentDefinition<CatDocument>): Promise<Cat> {
    try {
      return await this.catModel.create(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteCats (id: string): Promise<Cat> {
    return this.catModel.findByIdAndRemove(id);
  }

  async getById(query: FilterQuery<CatDocument>, options: QueryOptions = {lean: true}) {
    return this.catModel.findOne(query, {}, options);
  }

  async updateCat (query: FilterQuery<CatDocument>, update: UpdateQuery<CatDocument>, options: QueryOptions) {
    return this.catModel.findOneAndUpdate(query, update, options);
  }
}