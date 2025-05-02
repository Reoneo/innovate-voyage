
import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const ParamsSchema = z.object({ id: z.string().uuid() });

// Mock in-memory store - replace with your real data source later
const users = [
  { id: '11111111-1111-1111-1111-111111111111', username: 'alice', bio: 'Frontend wizard', avatar: 'https://cdn-icons-png.flaticon.com/512/6699/6699362.png' },
  { id: '22222222-2222-2222-2222-222222222222', username: 'bob', bio: 'API guru', avatar: 'https://cdn-icons-png.flaticon.com/512/6699/6699362.png' }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const parsed = ParamsSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid UUID' });
  
  const user = users.find(u => u.id === parsed.data.id);
  if (!user) return res.status(404).json({ error: 'Not found' });

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  return res.status(200).json({ 
    username: user.username, 
    bio: user.bio,
    avatar: user.avatar
  });
}
