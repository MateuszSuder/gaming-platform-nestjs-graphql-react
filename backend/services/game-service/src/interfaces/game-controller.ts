export interface IGameController {
  init(userId: string): any;

  start(...args: any): void;

  complete(...args: any): any;
}
