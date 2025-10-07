# Demo Backend – Run & Docs Guide

This guide shows how to run the Spring Boot backend locally on Windows and how to generate API documentation (Javadocs).

## Prerequisites

- JDK 21 (Adoptium/Temurin recommended)
- Maven Wrapper (included: `mvnw.cmd`)
- PostgreSQL (for runtime) or H2 (used by tests)

## 1) Configure environment

Set at least these environment variables before starting:

- Database: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_SCHEMA`, `DB_USER`, `DB_PASS`
- Server: `SERVER_PORT` (default 8000)
- JWT: `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`
- Optional providers:
  - RapidAPI: `RAPID_KEY`, `RAPID_HOST`, `RAPID_BASE_URL`
  - Finnhub: `FINNHUB_TOKEN`

PowerShell example:

```powershell
$env:DB_HOST='127.0.0.1'
$env:DB_PORT='5432'
$env:DB_NAME='portfolio_db'
$env:DB_SCHEMA='public'
$env:DB_USER='postgres'
$env:DB_PASS='postgres'
$env:SERVER_PORT='8000'
$env:JWT_SECRET='ChangeMeToAStrongSecret'
$env:JWT_EXPIRATION='900000'
$env:JWT_REFRESH_EXPIRATION='604800000'
$env:RAPID_KEY='your-rapidapi-key'
$env:RAPID_HOST='apidojo-yahoo-finance-v1.p.rapidapi.com'
$env:RAPID_BASE_URL='https://apidojo-yahoo-finance-v1.p.rapidapi.com'
$env:FINNHUB_TOKEN='your-finnhub-token'
```

Note: The `test` profile disables Finnhub automatically.

## 2) Run the backend

- Using Maven wrapper (hot compile):

```powershell
./mvnw.cmd spring-boot:run
```

- Or build a JAR and run it:

```powershell
./mvnw.cmd -DskipTests package
java -jar target/demo-backend-0.0.1-SNAPSHOT.jar
```

App starts on `http://localhost:$env:SERVER_PORT` (default 8000).

## 3) Tests (optional)

```powershell
./mvnw.cmd test
# Or only integration tests
./mvnw.cmd -Dtest=*IntegrationTest test
```

## 4) Generate Javadocs

The build is set to include private members and relax doclint so docs still generate even with warnings.

PowerShell (quote -D properties to avoid PS argument parsing quirks):

```powershell
./mvnw.cmd -DskipTests "-Dmaven.javadoc.failOnError=false" "-DadditionalJOptions=-Xdoclint:none" javadoc:javadoc javadoc:test-javadoc
```

CMD (Command Prompt) variant:

```bat
mvnw.cmd -DskipTests -Dmaven.javadoc.failOnError=false -DadditionalJOptions=-Xdoclint:none javadoc:javadoc javadoc:test-javadoc
```

Note: If you copy/paste from docs and see an error like "Unknown lifecycle phase '.javadoc.failOnError=false'", retype the dashes (use regular `-`, not an en-dash) or keep the `-D...` properties in quotes in PowerShell.

Outputs:

- Main Javadoc: `target/site/apidocs/index.html`
- Test Javadoc: `target/site/testapidocs/index.html`

## Troubleshooting

- If Maven reports a POM parse error, open `pom.xml` and check for stray/invalid tags.
- If you try to run `javadoc` directly and see missing dependencies, use the Maven goals above so the classpath is resolved properly.

## Health check

Actuator health: `http://localhost:$env:SERVER_PORT/actuator/health`

---
