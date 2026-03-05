
export default class SubmissionController {

  constructor(submissionService) {
    this.submissionService = submissionService;
  }

  async create(req, res, next) {
    try {
      const { assignmentId, content } = req.body;

      const submission = await this.submissionService.create(
        assignmentId,
        content,
        req.user
      );

      return res.status(201).json(submission);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const submission = await this.submissionService.findById(
        req.params.id,
        req.user
      );

      return res.json(submission);

    } catch (error) {
      next(error);
    }
  }

  async evaluate(req, res, next) {
    try {
      const { decision, feedback, score } = req.body;

      const updatedSubmission = await this.submissionService.evaluate(
        req.params.id,
        decision,
        score,
        feedback,
        req.user
      );

      return res.json(updatedSubmission);

    } catch (error) {
      next(error);
    }
  }
}