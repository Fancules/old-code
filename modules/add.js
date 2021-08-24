import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    team: {
        type: String,
        required: true
    },
    estDate: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

// TeamSchema.method('toClient', function () {
//     const team = this.toObject();

//     team.id = team._id;
//     delete team._id;
//     return team;
// });

export default mongoose.model('Team', TeamSchema);
