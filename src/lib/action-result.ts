/** Standard result returned by server actions to the client. */
export type ActionResult =
  | { success: true }
  | { success: false; message: string };
