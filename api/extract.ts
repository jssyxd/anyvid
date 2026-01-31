import type { VercelRequest, VercelResponse } from '@vercel/node';

// List of public Cobalt instances to try
// Source: https://instances.cobalt.best/
const INSTANCES = [
  'https://cobalt.kwiatekmiki.pl',
  'https://cobalt.q1.pm',
  'https://cobalt.synrs.co',
  'https://dl.khub.students.nom.za',
  'https://cobalt.sxy2.site',
  'https://cobalt.154.53.56.152.sslip.io'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  // Try instances one by one
  for (const instance of INSTANCES) {
    try {
      console.log(`Trying extraction via: ${instance}`);
      const response = await fetch(instance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'AnyVid/1.0'
        },
        body: JSON.stringify({
          url: url,
          videoQuality: '720'
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Check if data is valid (sometimes cobalt returns status: error)
        if (data.status === 'error') {
            console.warn(`Instance ${instance} returned error:`, data.text);
            continue;
        }
        
        return res.status(200).json({
          status: 'success',
          data: {
            title: data.filename || 'Video',
            url: data.url,
            thumbnail: '', // Cobalt doesn't always return thumb in basic response, but that's okay
            source: 'Cobalt'
          }
        });
      } else {
          console.warn(`Instance ${instance} failed with ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to reach ${instance}:`, error);
    }
  }

  return res.status(500).json({ 
    error: 'All extraction instances failed. Please try again later or check the URL.',
    debug: 'Cobalt proxy failed'
  });
}
