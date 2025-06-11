# mini-data365-backend
A simple API for discovering and analyzing tech niche influencers on Instagram and YouTube, with ML-driven niche detection and fraud analysis.

## Features
- Search influencers by niche, follower count, and platform.
- Basic analytics (engagement rates, post metrics).
- Niche detection using Phi-3-mini LLM.
- Fraud detection with scikit-learn.

## Setup
1. Clone repo: `git clone https://github.com/JasirBasheer/mini-data365-backend`
2. Install dependencies: `cd mini-data365-backend && npm install`
3. Setup Python: `cd ml && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
4. Configure `.env` with MongoDB, YouTube/Data365 API, and Gmail credentials.
5. Collect data: `node scripts/youtubeScraper.js && node scripts/data365Scraper.js`
6. Process data: `node scripts/processData.js`
7. Start server: `npm start`

## Test
- Health: `curl http://localhost:5000/api/health`
- Search: `curl "http://localhost:5000/api/influencers/search?query=tech%20niche%20from%2040k%20to%20100k%20followers%20on%20Instagram%20and%20YouTube"`

## Notes
- Uses YouTube Data API, and limited Instagram scraping.
- ~5,000 influencers; daily updates.
  
## License
MIT
