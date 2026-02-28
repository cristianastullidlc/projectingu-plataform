

export default class ChallengeController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res, next) {
    try {
      const result = await this.service.create(req.body, req.user);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await this.service.getById(req.params.id, req.user);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

 async getAll(req, res, next) {
  try {
    const {
      createdBy,
      title,
      description,
      status,
      techStack,
      difficulty,
      deadline
    } = req.query;

    const filter = {};

    if (createdBy) filter.createdBy = createdBy;
    if (title) filter.title = title;
    if (description) filter.description = description;
    if (status) filter.status = status;
    if (techStack) filter.techStack = techStack;
    if (difficulty) filter.difficulty = difficulty;
    if (deadline) filter.deadline = deadline;

    const result = await this.service.getAll(filter, req.user);

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

  async publish(req, res, next) {
    try {
      const result = await this.service.publish(req.params.id, req.user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async close(req, res, next) {
    try {
      const result = await this.service.close(req.params.id, req.user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.service.delete(req.params.id, req.user);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.service.update(req.params.id, req.body, req.user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}