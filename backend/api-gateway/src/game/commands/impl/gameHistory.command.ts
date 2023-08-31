export class GameHistoryCommand {
  constructor(
    public readonly userId,
    public readonly offset: number,
    public readonly limit: number,
  ) {}
}
