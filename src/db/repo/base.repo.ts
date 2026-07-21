import mongoose, {
    DeleteResult,
    FilterQuery,
    Model,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
    UpdateResult,
    PopulateOptions
} from "mongoose";

export abstract class baseRepository<T> {

    constructor(private model: Model<T>) { }

    async createNewDocument(document: Partial<T>): Promise<T> {
        return await this.model.create(document);
    }

    async findOneDocument(
        filters: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T> & {
            populate?: PopulateOptions | PopulateOptions[];
        }
    ): Promise<T | null> {

        const query = this.model.findOne(filters, projection, options);

        if (options?.populate) {
            query.populate(options.populate);
        }

        return await query;
    }

    async findDocumentById(
        id: string | Types.ObjectId,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T> & {
            populate?: PopulateOptions | PopulateOptions[];
        }
    ): Promise<T | null> {

        const query = this.model.findById(id, projection, options);

        if (options?.populate) {
            query.populate(options.populate);
        }

        return await query;
    }

    async findDocumentByIdAndUpdate(
        id: string | Types.ObjectId,
        updatedObject: UpdateQuery<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {

        return await this.model.findByIdAndUpdate(
            id,
            updatedObject,
            {
                runValidators: true,
                ...options
            }
        );
    }

    async updateOneDocument(
        filters: FilterQuery<T>,
        updatedObject: UpdateQuery<T>,
        options?: QueryOptions<T>
    ): Promise<T | null> {

        return await this.model.findOneAndUpdate(
            filters,
            updatedObject,
            {
                runValidators: true,
                ...options
            }
        );
    }

    async updateMultipleDocument(
        filters: FilterQuery<T>,
        updatedObject: UpdateQuery<T>
    ): Promise<UpdateResult> {

        return await this.model.updateMany(filters, updatedObject);
    }

    async deleteOneDocument(filters: FilterQuery<T>): Promise<DeleteResult> {
        return await this.model.deleteOne(filters);
    }

    async deleteMultipleDocument(filters: FilterQuery<T>): Promise<DeleteResult> {
        return await this.model.deleteMany(filters);
    }

    async findAndDeleteDocument(filters: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOneAndDelete(filters);
    }

    async findDocuments(
        filters: FilterQuery<T> = {},
        projection?: ProjectionType<T>,
        options?: QueryOptions<T> & {
            populate?: PopulateOptions | PopulateOptions[];
        }
    ): Promise<T[]> {

        const query = this.model.find(filters, projection, options);

        if (options?.populate) {
            query.populate(options.populate);
        }

        return await query;
    }

    async countDocuments(filters: FilterQuery<T> = {}): Promise<number> {
        return await this.model.countDocuments(filters);
    }

    async exists(filters: FilterQuery<T>): Promise<{ _id: Types.ObjectId } | null> {
        return await this.model.exists(filters);
    }

    async deleteById(id: string | Types.ObjectId): Promise<T | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async insertMany(documents: Partial<T>[]) {
        return await this.model.insertMany(documents);
    }

}