# automation_beta

## Structure
- client: React + TypeScript + Tailwind (Vite)
- server: Express + TypeScript

## Scripts
### Client
- `npm run dev` (in client)
- `npm run build` (in client)

### Server
- `npm run dev` (in server)
- `npm run build` (in server)
- `npm start` (in server)

## Notes
- Tailwind is configured in client/tailwind.config.js and client/src/index.css.
- Server health endpoint: `GET /health`.
- Server uses MongoDB at `mongodb://localhost:27017/automation_beta` (override with `MONGO_URL`).

## Auth (demo)
### Register
`POST /api/register`
```json
{
	"name": "Олена",
	"nickname": "codeFox",
	"classLevel": 5,
	"password": "123456"
}
```

### Login
`POST /api/login`
```json
{
	"identifier": "codeFox",
	"password": "123456"
}
```

## Game Framework (demo)
Points are stored on the student and awarded once per level.

### List games
`GET /api/games`

### Create game
`POST /api/games`
```json
{
	"id": "arrays",
	"name": "Arrays Basics",
	"levels": [
		{ "id": "level-1", "points": 10 },
		{ "id": "level-2", "points": 15 }
	]
}
```

### Start game
`POST /api/games/:gameId/start`
```json
{
	"studentId": "<student-id>"
}
```

### Complete level
`POST /api/games/:gameId/complete`
```json
{
	"studentId": "<student-id>",
	"levelId": "level-1",
	"isCorrect": true
}
```
