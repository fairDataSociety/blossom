export interface BlossomMessages {
  /**
   * Sends a message to the Blossom extension and waits for response
   * @param action Action of the Blossom extension
   * @param parameters Depends of the action
   * @returns Promise with response from the extension
   */
  sendMessge<Response>(action: string, parameters?: unknown): Promise<Response>
}
