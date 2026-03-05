export default class AssignmentController {

  constructor(assignmentService) {
    this.assignmentService = assignmentService;
  }


  async create(req, res, next) {
    try {
      const { challengeId, candidateId, deadlineOverride } = req.body;

      const assignment = await this.assignmentService.create(
        challengeId,
        candidateId,
        req.user,
        deadlineOverride
      );

      return res.status(201).json(assignment);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const assignment = await this.assignmentService.findById(
        req.params.id,
        req.user
      );

      return res.json(assignment);

    } catch (error) {
      next(error);
    }
  }


  async getByChallenge(req, res, next) {
    try {
      const assignments =
        await this.assignmentService.findByChallengeId(
          req.params.challengeId,
          req.user
        );

      return res.json(assignments);

    } catch (error) {
      next(error);
    }
  }


  async getByCandidate(req, res, next) {
    try {
      const assignments =
        await this.assignmentService.findByCandidateId(
          req.params.candidateId,
          req.user
        );

      return res.json(assignments);

    } catch (error) {
      next(error);
    }
  }


  async updateStatus(req, res, next) {
    try {
      const { action } = req.body;

      const updatedAssignment =
        await this.assignmentService.updateStatus(
          req.params.id,
          action,
          req.user
        );

      return res.json(updatedAssignment);

    } catch (error) {
      next(error);
    }
  }
}