// These enums are mirrored 1:1 from the Node.js backend
// (src/common/enums/user.enum.ts) so the frontend and API never drift.

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female'
}

export enum RoleEnum {
  TOURIST = 'tourist',
  DRIVER = 'driver',
  GUIDE = 'guide',
  ADMIN = 'admin'
}

export enum StatusUserEnum {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  PENDING = 'pending'
}

export enum OtpTypesEnum {
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'reset_password'
}

export enum VerificationStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum TripStatusEnum {
  ACTIVE = 'active',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum VoteValueEnum {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export enum LostItemStatusEnum {
  PENDING = 'pending',
  FOUND = 'found',
  CLOSED = 'closed'
}
