# 🎤 TTS Uploader (Amazon Polly + AWS Lambda)

A TypeScript + AWS SDK v3 powered application to generate MP3 files from text using Amazon Polly, and optionally upload them to S3 or save locally. Designed to work both locally and as a Lambda function.

## Features

- Text-to-Speech with Amazon Polly
- Save MP3s locally in development
- Upload to S3 in production (skip if file already exists)
- AWS SDK v3 + TypeScript
- Client/server separation (Vue + Lambda)
- Unit testing with Vitest, E2E testing with Playwright

## Project Structure

```
Project/
├── client/                   # Frontend (Vue.js)
│   ├── public/
│   ├── questions/                # JSON-based quiz content (including listening.json)
│   ├── src/                      # Main source code
│   ├── tests/                    # Vitest + Playwright tests
│   ├── package.json
│   └── vite.config.ts (and other config files)
│
├── server/                 # Backend (Lambda)
│   ├── index.ts                 # Lambda + local entry point
│   ├── uploadIfNotExists.ts     # Core TTS & S3 logic
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                     # Not committed
│   └── audio/                   # Local MP3s (dev only, NOT uploaded)
```

> Note: The `audio/` directory is used only for local development. MP3s are generated from `client/questions/listening.json` and uploaded to S3 if not already present.

## Environment Variables

Create a `.env` file inside `server/`:

```dotenv
AUDIO_OUTPUT_BUCKET=your-bucket-name
POLLY_VOICE_ID=Joanna
LOCAL=true
```

> `LOCAL=true` to save files locally instead of S3

## Local Development

From `server/`:

```bash
npm install
npx ts-node index.ts
```

MP3s will be saved to `./audio/`.

## Deploy to Lambda

1. Compile TypeScript

```bash
npx tsc
```

2. Package and deploy:

```bash
mkdir -p deploy
cp -r dist/* node_modules package.json deploy/
cd deploy
zip -r function.zip .

aws lambda update-function-code \
  --function-name ttsUploader \
  --zip-file fileb://function.zip
```

## License

MIT © 2025 Kaori Era