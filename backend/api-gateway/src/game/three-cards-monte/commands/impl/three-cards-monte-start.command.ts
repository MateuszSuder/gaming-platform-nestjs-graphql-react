export class ThreeCardsMonteStartCommand {
  constructor(
    public readonly userId: string,
    public readonly bet: number,
    public readonly cardNumber: number,
  ) {}
}
