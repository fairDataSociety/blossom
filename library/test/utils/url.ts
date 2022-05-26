export function getPageUrl(pageName: string, blossomId: string): string {
  return `http://localhost:9000/test/webpages/${pageName}/?blossomId=${blossomId}`
}
