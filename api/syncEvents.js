import { syncEvents } from '../lib/syncEvents.js';

export default async function handler(req, res) {
  try {
    await syncEvents();
    res.status(200).json({ message: 'Events synced to Sanity.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
