export const generateId = (): number => {
  console.log(Date.now().toString(36))

  return Math.random()
}
