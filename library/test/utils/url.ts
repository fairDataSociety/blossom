import { TEST_SERVER_URL } from '../config/constants'

export function getPageUrl(pageName: string, blossomId: string): string {
  return `${TEST_SERVER_URL}/test/webpages/${pageName}/?blossomId=${blossomId}`
}
