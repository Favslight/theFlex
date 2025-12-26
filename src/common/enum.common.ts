export enum UserRole {
  ADMIN = 'ADMIN',
  INVESTOR = 'INVESTOR',
  AGENT = 'AGENT',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER',
}
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AuthType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export enum OrderStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  DECLINED = 'DECLINED',
}

export enum InvestmentType {
  'BRONZE' = 'BRONZE',
  'SILVER' = 'SILVER',
  'GOLD' = 'GOLD',
  'PLATINUM' = 'PLATINUM',
}

export enum TransactionMode {
  NOT_SELECTED = 'NOT_SELECTED',
  PAYSTACK = 'PAYSTACK',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESSFUL = 'SUCCESSFUL',
}
