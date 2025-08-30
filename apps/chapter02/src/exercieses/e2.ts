// Value Object
class Time24 {
  #hour: number;
  #minute: number;

  constructor(hour: number, minute: number) {
    if (hour < 0 || hour > 24) throw new Error('Hour must be in [0, 24]');
    if (minute < 0 || minute > 59) throw new Error('Minute must be in [0, 59]');

    this.#hour = hour;
    this.#minute = minute;
  }

  get hour(): number {
    return this.#hour;
  }

  get minute(): number {
    return this.#minute;
  }

  equal(otherTime: Time24) {
    return this.hour === otherTime.#hour && this.minute === otherTime.minute;
  }
}

// Entity
class User {
  #id: string;
  #name: string;
  #createdAt: Time24;
  constructor(id: string, name: string, createdAt: Time24) {
    if (!id || !name) throw new Error(`User's id and User's name cannot be empty`);
    this.#id = id;
    this.#name = name;
    this.#createdAt = createdAt;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get createdAt() {
    return this.#createdAt;
  }

  isIdentical(otherUser: User) {
    return this.id === otherUser.id;
  }
}
