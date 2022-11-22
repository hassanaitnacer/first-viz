import dt from "date-and-time"

export const calcAge = (dateOfBirth) => {
  const today = new Date()

  return Math.floor(dt.subtract(today, dateOfBirth).toDays() / 365)
}
