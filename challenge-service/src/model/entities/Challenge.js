
export default class Challenge {
  constructor({
    id = null,
    title,
    description,
    difficulty,
    techStack = [],
    createdBy,
    status = "draft",
    deadline,
    isDeleted = false,
    deletedAt = null,
    createdAt = new Date(),
    lastUpdatedAt = new Date()
  }) {
    if (!title) throw new Error("Title is required");
    if (!description) throw new Error("Description is required");
    if (!difficulty) throw new Error("Difficulty is required");
    if (!createdBy) throw new Error("createdBy is required");
    if (!deadline) throw new Error("Deadline is required");

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw new Error("Invalid deadline date");
    }

    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.techStack = Array.isArray(techStack) ? techStack : [];
    this.createdBy = createdBy;
    this.status = status;
    this.deadline = parsedDeadline;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.lastUpdatedAt = lastUpdatedAt;
  }

  // =========================
  // Ownership
  // =========================

  validateOwnership(userId) {
    if (this.createdBy !== userId) {
      throw new Error("You are not the owner of this challenge");
    }
  }

  // =========================
  // Updates
  // =========================

  changeTitle(newTitle) {
    if (!newTitle) throw new Error("Title cannot be empty");
    this.title = newTitle;
    this.touch();
  }

  changeDescription(newDescription) {
    if (!newDescription) throw new Error("Description cannot be empty");
    this.description = newDescription;
    this.touch();
  }

  changeDifficulty(newDifficulty) {
    const allowed = ["easy", "medium", "hard"];
    if (!allowed.includes(newDifficulty)) {
      throw new Error("Invalid difficulty value");
    }
    this.difficulty = newDifficulty;
    this.touch();
  }

  changeTechStack(newTechStack) {
    if (!Array.isArray(newTechStack)) {
      throw new Error("Tech stack must be an array");
    }
    this.techStack = newTechStack;
    this.touch();
  }

  addTechStackItem(newTech) {
    if (!newTech) throw new Error("Tech cannot be empty");
    if (!this.techStack.includes(newTech)) {
      this.techStack.push(newTech);
      this.touch();
    }
  }

  removeTechStackItem(techToRemove) {
    this.techStack = this.techStack.filter(
      tech => tech !== techToRemove
    );
    this.touch();
  }

  changeDeadline(newDeadline) {
    const parsedDeadline = new Date(newDeadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw new Error("Invalid deadline date");
    }

    if (parsedDeadline <= new Date()) {
      throw new Error("Deadline must be in the future");
    }

    this.deadline = parsedDeadline;
    this.touch();
  }

  // =========================
  // Status management
  // =========================

  publish() {
    if (this.status === "published") {
      throw new Error("Challenge is already published");
    }

    if (this.status === "closed") {
      throw new Error("Cannot publish a closed challenge");
    }

    if (this.deadline <= new Date()) {
      throw new Error("Cannot publish challenge with expired deadline");
    }

    this.status = "published";
    this.touch();
  }

  close() {
    if (this.status === "closed") {
      throw new Error("Challenge is already closed");
    }

    this.status = "closed";
    this.touch();
  }

  // =========================
  // Soft delete
  // =========================

  markAsDeleted() {
    if (this.isDeleted) {
      throw new Error("Challenge is already deleted");
    }

    this.isDeleted = true;
    this.deletedAt = new Date();
    this.touch();
  }

  restore() {
    if (!this.isDeleted) {
      throw new Error("Challenge is not deleted");
    }

    this.isDeleted = false;
    this.deletedAt = null;
    this.touch();
  }

  // =========================
  // Utilities
  // =========================

  isEditable() {
    return this.status !== "closed" && !this.isDeleted;
  }

  isExpired() {
    return this.deadline <= new Date();
  }

  touch() {
    this.lastUpdatedAt = new Date();
  }
}