enum genderEnum {
    MALE = 'male',
    FEMALE = 'female'
}

enum roleEnum {
    TOURIST = "tourist",
    DRIVER = "driver",
    GUIDE = "guide",
    ADMIN = "admin"
}

enum statusUserEnum {
    ACTIVE = "active",
    BLOCKED = "blocked",
    PENDING = "pending"
}

enum otpTypesEnum {
    CONFIRMATION = 'confirmation',
    RESET_PASSWORD = 'reset_password',
}

enum verificationStatusEnum {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}

enum tripStatusEnum {
    DRAFT = "draft",
    PENDING = "pending",
    CONFIRMED = "confirmed",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

enum voteValueEnum {
    LIKE = "like",
    DISLIKE = "dislike"
}

enum lostItemStatusEnum {
    PENDING = "pending",
    FOUND = "found",
    CLOSED = "closed"
}

export { genderEnum, roleEnum, statusUserEnum, otpTypesEnum, verificationStatusEnum, tripStatusEnum, voteValueEnum, lostItemStatusEnum }