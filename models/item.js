import mongoose from 'mongoose';
const { Schema } = mongoose;

const ItemSchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    price: {type: Decimal128, required: true},
    stock: {type: Number, required: true},
});

// Virtual for item URL.
ItemSchema
    .virtual('url')
    .get(function() {
        return `/inventory/item/${this._id}`;
    });

export default mongoose.models('Item', ItemSchema);