# Momos Media Scraper

- Create an API which will accept an array for Web URL in the request Body.
- Add Basic Server Auth Middleware.
- Add Middleware for Logging and Error Handling.
- Scrap Image and Video URLs for requested Web URL's.
- Store All Data into any SQL database.
- Create a simple web page for showing all the Images and Video's.
- Paginate front-end API and we can filter data based upon type and search text.
- Use Node.js for backend and React.js for front-end.
- Dockerize your code using docker-compose or any docker orchestrator that can be run on personal computers.
- Support both server-side rendering and client side rendering (React, Angular..) scraper.
- The system should be able to efficiently handle ~5000 scraping requests at the same time, considering a server with only 1 CPU and 1GB RAM and write a load test for this feature.

## Installation & Usage

### Prerequisites
- Docker & Docker Compose
- Node.js

### Running the Project
1. **Clone & Start**:
   ```bash
   docker-compose up -d --build
   ```
   This starts:
   - PostgreSQL (Port 5432)
   - Redis (Port 6379)
   - Backend API (Port 3000)
   - Frontend UI (Port 5173)

2. **Access the Scraper**:
   - Web UI: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:3000](http://localhost:3000)

4. **Running Load Test**:
   The project includes a script to simulate 5000 concurrent requests.
   ```bash
   k6 run k6-scripts/load-test.js
   ```

### API Endpoints
- `POST /api/scrape`: `{ urls: string[] }` - Submit jobs.
- `GET /api/public/media`: `?page=1&limit=20&type=IMAGE|VIDEO&search=...` - Get media.
