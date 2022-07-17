export type SupabaseAuthPayload = {
  email: string;
  // optional for magic link
  password?: string;
};
