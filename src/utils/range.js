export const scoreRange = (score) => {
  if (score < 5) return "<5"
  if (score < 10) return "5-9"
  if (score < 15) return "10-14"
  if (score >= 15) return ">14"
}
