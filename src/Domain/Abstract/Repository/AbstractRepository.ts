import { Model } from "mongoose";

import RepositoryMapper from "../DTOs/RepositoryMapperInterface";

export default abstract class AbstractRepository<TEntity, TDTO> {
  protected readonly model: Model<TEntity>;
  protected readonly mapper: RepositoryMapper<TEntity, TDTO>;

  constructor(model: Model<TEntity>, mapper: RepositoryMapper<TEntity, TDTO>) {
    this.model = model;
    this.mapper = mapper;
  }

  async findAll(): Promise<TDTO[]> {
    const docs = await this.model.find().lean();
    return docs.map(d => this.mapper.toDTO(d as unknown as TEntity));
  }

  async findById(id: string): Promise<TDTO | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.mapper.toDTO(doc as TEntity) : null;
  }

  async create(dto: TDTO): Promise<TDTO> {
	  try {
		const toCreate = this.mapper.toEntity(dto);
	    const created = await this.model.create(toCreate as any);
        const plain = typeof (created as any).toObject === "function"
        ? (created as any).toObject()
        : created;
    	return this.mapper.toDTO(plain as TEntity);
	  } catch (error) {
		console.log(error);
		throw error;
	  }
  }

  async update(id: string, dto: TDTO): Promise<TDTO | null> {
    const toUpdate = this.mapper.toEntity(dto);
    const updated = await this.model.findByIdAndUpdate(id, toUpdate as any, { new: true, lean: true });
    return updated ? this.mapper.toDTO(updated as unknown as TEntity) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.model.findByIdAndDelete(id);
    return !!res;
  }
}