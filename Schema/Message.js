const mongoose = require("mongoose")
const { Schema } = mongoose

const messageSchema = new Schema({
    message: { type: String, required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: "Support", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Signup", required: true },
    senderType: { type: String, enum: ["User", "Admin"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
