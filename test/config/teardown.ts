export default async () => {
  if (!process.argv.includes('--demo=true')) await global.__BROWSER__.close()
}
