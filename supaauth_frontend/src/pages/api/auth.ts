import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '~/lib/supabase';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supabase exposes the cookie setters and getter methods for server-side usage on the auth.api namespace
  supabase.auth.api.setAuthCookie(req, res);
}
