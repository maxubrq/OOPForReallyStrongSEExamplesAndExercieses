class MotorWheel {
  readonly r: number;

  constructor(r: number) {
    if (r <= 0) throw new Error('MotorWheel must have radius greater than 0');
    this.r = r;
  }

  roll() {
    console.log(`I am rolling`);
  }

  equal(otherWheel: MotorWheel) {
    return this.r === otherWheel.r;
  }
}

class MotorBike {
  #wheels: MotorWheel[] = [];
  constructor(wheels: MotorWheel[]) {
    if (wheels.length !== 2) throw new Error('MotorBike need exactly 2 wheels to run');

    if (!wheels[0].equal(wheels[1]))
      throw new Error('MotorBike wheels need to have the same radius');

    this.#wheels = wheels;
  }

  run() {
    this.#wheels[0].roll();
    this.#wheels[1].roll();
    console.log('I am running');
  }
}
