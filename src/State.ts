export class State {
  public name: string;
  public entering: string | null;
  public exiting: string | null;
  public changed: string | null;
  protected transitions: { [action: string]: string | undefined } = {};

  constructor(
    name: string,
    entering: string | null = null,
    exiting: string | null = null,
    changed: string | null = null,
  ) {
    this.name = name;
    this.entering = entering || null;
    this.exiting = exiting || null;
    this.changed = changed || null;
  }

  public defineTransition(action: string, target: string): void {
    if (this.getTarget(action) != null) return;
    this.transitions[action] = target;
  }

  public removeTransition(action: string): void {
    this.transitions[action] = undefined;
  }

  public getTarget(action: string | undefined): string | undefined {
    return action ? this.transitions[action] : undefined;
  }
}
