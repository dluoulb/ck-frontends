export const CardType = Object.freeze({
  PHYSICAL: 'PHYSICAL',
  VIRTUAL: 'VIRTUAL',
} as const);

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  STOLEN = 'STOLEN',
  SUSPEND = 'SUSPEND',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}
