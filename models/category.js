import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
});


// Virtual for category URL.
CategorySchema
    .virtual('url')
    .get(function() {
        return `/inventory/category/${this._id}`;
    });

export default mongoose.model('Category', CategorySchema);