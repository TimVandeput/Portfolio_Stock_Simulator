# Railway Deployment Guide for Portfolio Stock Simulator

## Prerequisites

- GitHub account with your code pushed
- API keys (RapidAPI, Finnhub)
- Railway account (free tier available)

## Step-by-Step Deployment

### 1. Setup Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `Portfolio_Stock_Simulator` repository
6. Select the `production` branch

### 2. Configure Build Settings

Railway should auto-detect your Java Spring Boot app, but verify:

- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/demo-backend-0.0.1-SNAPSHOT.jar`
- **Port**: Railway will automatically set the PORT environment variable

### 3. Add PostgreSQL Database

1. In your project dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set these environment variables:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### 4. Set Required Environment Variables

In your Railway project settings → Variables, add:

**Required:**

- `JWT_SECRET`: A secure random string (256+ bits)
- `RAPID_KEY`: Your RapidAPI key
- `FINNHUB_TOKEN`: Your Finnhub API token

**Optional (with defaults):**

- `JWT_EXPIRATION`: 900000 (15 minutes)
- `JWT_REFRESH_EXPIRATION`: 604800000 (7 days)
- `RAPID_HOST`: apidojo-yahoo-finance-v1.p.rapidapi.com
- `RAPID_BASE_URL`: https://apidojo-yahoo-finance-v1.p.rapidapi.com
- `FINNHUB_WS_URL`: wss://ws.finnhub.io
- `FINNHUB_ENABLED`: true

### 5. Deploy

1. Click "Deploy" in Railway
2. Monitor the build logs
3. Once deployed, Railway will provide you with a public URL

### 6. Verify Deployment

Test these endpoints:

- `https://your-app.railway.app/actuator/health` - Should return {"status":"UP"}
- `https://your-app.railway.app/actuator/info` - Should return app information

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that Java 21 is being used
2. **App crashes**: Verify all required environment variables are set
3. **Database connection fails**: Ensure PostgreSQL service is running
4. **Port issues**: Railway automatically sets PORT, don't override unless necessary

### Checking Logs:

- View deployment logs in Railway dashboard
- Use `railway logs` if using CLI

## Cost Considerations

- Railway offers a generous free tier
- PostgreSQL database is included in free tier
- Monitor usage in Railway dashboard

## Security Notes

- Never commit API keys to your repository
- Use Railway's environment variables for all secrets
- JWT_SECRET should be a cryptographically secure random string
