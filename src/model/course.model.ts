import { model, Schema, Model, Document, Types } from 'mongoose';

export interface ICourse extends Document {
  crosslistCodes: string[]; // codes of the department
  title: string; // title of the course
  description: string; // description of the course
  professors: Types.ObjectId[]; // professors for this course
  prereqs: Types.ObjectId[]; // prerequisites for this course
  distribs: Types.ObjectId[]; // distributions for this course
  worldCulture: string;
  termsOffered: string[]; // terms offered for this course
  pe: boolean; // pe for this course
  fys: boolean; // fys for this course
  language: string; // language for this course
  medians: number[]; // medians for this course
  layupListPage: string;
  avgTimeCommitment: number; // avgTimeCommitment for this course
  avgDifficulty: number; // avgDifficulty for this course
  waitlist: Types.ObjectId[]; // waitlist for this course
  reviews: Types.ObjectId[]; // reviews for this course
  syllabi: string[]; // syllabi for this course


  createDate: Date;
  updatedDate: Date;
  timestamps?: {};
}

const CourseSchema: Schema = new Schema({
  crosslistCodes: [{ type: String, required: true }], // codes of the department
  title: { type: String, required: true }, // title of the course
  description: { type: String, required: true }, // description of the course
  professors: [{ type: Schema.Types.ObjectId, ref: 'Professor' }], // professors for this course
  prereqs: [{ type: Schema.Types.ObjectId, ref: 'Course' }], // prerequisites for this course
  distribs: [{ type: Schema.Types.ObjectId, ref: 'Distrib' }], // distributions for this course
  worldCulture: { type: String, required: true }, // worldCulture for this course
  termsOffered: [{ type: String, required: true }], // terms offered for this course
  pe: { type: Boolean, required: true }, // pe for this course
  fys: { type: Boolean, required: true }, // fys for this course
  language: { type: String, required: true }, // language for this course
  medians: [{ type: Number, required: true }], // medians for this course
  layupListPage: { type: String, required: true }, // layupListPage for this course
  avgTimeCommitment: { type: Number, required: true }, // avgTimeCommitment for this course
  avgDifficulty: { type: Number, required: true }, // avgDifficulty for this course
  waitlist: [{ type: Schema.Types.ObjectId, ref: 'Waitlist' }], // waitlist for this course
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }], // reviews for this course
  syllabi: [{ type: String, required: true }], // syllabi for this course

  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  timestamps: { createDate: Date, updatedDate: Date }
}
);

export const CourseModel: Model<ICourse> = model<ICourse>('Course', CourseSchema);