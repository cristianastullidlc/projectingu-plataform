

export default class User {
  constructor({ userId, name, lastName, identification, email, role, providerId }) {
    if (!userId) throw new Error("userId is required");
    if (!name) throw new Error("name is required");
    if (!lastName) throw new Error("lastName is required");
    if (!identification) throw new Error("identification is required");
    if (!email) throw new Error("email is required");
    if (!role) throw new Error("role is required");
    if (!providerId) throw new Error("providerId is required");

    this.userId = userId;
    this.name = name;
    this.lastName = lastName;
    this.identification = identification;
    this.email = email;
    this.role = role;
    this.providerId = providerId;
  }

  changeName(name) {
    this.name = name;
  }
  
  changeLastName(lastName) {
    this.lastName = lastName;
  }

    changeEmail(email) {
    this.email = email;
  }

}
