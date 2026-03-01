import SubmissionRepositoryMapper from "../../utils/SubmissionRepositoryMapper.js";

export default class SubmissionRepository {

  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    const doc = await this.model.findById(id).lean();
    return SubmissionRepositoryMapper.toDomain(doc);
  }

  async findByAssignmentId(assignmentId) {
    const doc = await this.model
      .findOne({ assignmentId })
      .lean();

    return SubmissionRepositoryMapper.toDomain(doc);
  }

  async create(submission) {
    const persistence =
      SubmissionRepositoryMapper.toPersistence(submission);

    const created = await this.model.create(persistence);

    return SubmissionRepositoryMapper.toDomain(created.toObject());
  }

  async update(submission) {
    const persistence =
      SubmissionRepositoryMapper.toPersistence(submission);

    const updated = await this.model
      .findByIdAndUpdate(
        submission.id,
        persistence,
        { new: true }
      )
      .lean();

    return SubmissionRepositoryMapper.toDomain(updated);
  }

  async existsByAssignment(assignmentId) {
    const count = await this.model.countDocuments({ assignmentId });
    return count > 0;
  }
}