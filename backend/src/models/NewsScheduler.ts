import mongoose,{Schema,Document} from "mongoose";

export interface INewsScheduler extends Document {
    user_id: mongoose.Types.ObjectId;
    summary_id: mongoose.Types.ObjectId;
    send_time: Date;
    send_method: string[];
    status: boolean;
}

const newsSchedulerSchema: Schema = new Schema ({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User',required: true },
    summary_id: { type: mongoose.Types.ObjectId, ref: 'NewsSummary', required: true },
    send_time: { type: Date, required: true },
    send_method: { type: [String], enum: ["telegram", "email"], default: ["telegram"] },
    status: { type: Boolean, default: false }
});

const NewsScheduler = mongoose.model<INewsScheduler>("NewsScheduler", newsSchedulerSchema);
export default NewsScheduler;