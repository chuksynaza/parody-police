import mongoose from 'mongoose';

export const setupDatabase = async () => {
    await mongoose.connect('mongodb://localhost/parody_police', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}