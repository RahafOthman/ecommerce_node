import mongoose, {Schema, model, Types} from "mongoose";

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true, 
        unique: true, 
    },
    slug: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        required: true,
    },
    categoryId: { type: Types.ObjectId, ref: 'Category'},
    createdBy:{ type: Types.ObjectId, ref: 'User', required:true},
    updatedBy:{ type: Types.ObjectId, ref: 'User', required:true}

},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
    timestamps: true,
});

subCategorySchema.virtual('products',{
    localField:'_id',
    foreignField:'subCategoryId',
    ref:'Product'
})

const subCategoryModel = mongoose.models.subCategory || model('subCategory', subCategorySchema);
export default subCategoryModel ; 
