export class Clock {
  private time = this.period

  constructor(private period: number) {}

  update(dt: number) {
    this.time -= dt

    if (this.time <= 0) {
      this.time = this.period
      return true
    }

    return false
  }
}
