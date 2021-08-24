import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                teamId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Team',
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(team) {
    const items = [...this.cart.items];

    const index = items.findIndex(c => {
        return c.teamId.toString() === team.toString();
    });

    if(index >= 0) {
        items[index].count += 1;
    }else {
        items.push({
            count: 1,
            teamId: team
        });
    }

    this.cart = {items};

    return this.save();
}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items];
    const index = items.findIndex(c => {
        return c.teamId.toString() === id.toString();
    });

    if(items[index].count === 1){
        items = items.filter(c => c.teamId.toString() !== id.toString());
    }else {
        items[index].count--;
    }

    this.cart = {items};

    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []};

    return this.save();
}

export default mongoose.model('User', userSchema);