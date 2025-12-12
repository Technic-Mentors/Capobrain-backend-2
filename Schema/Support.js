const mongoose = require("mongoose")
const { Schema } = mongoose

const supportSchema = new Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    severity: { type: String, required: true },
    ticketId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    userId: { type: Schema.Types.ObjectId, ref: "Signup", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Support", supportSchema);
