// import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { PollyClient, SynthesizeSpeechCommand, VoiceId } from '@aws-sdk/client-polly'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { uploadIfNotExists } from './uploadIfNotExists'

interface LambdaEvent {
  body?: string
}

interface LambdaResponse {
  statusCode: number
  body: string
  headers?: { [key: string]: string }
}

const corsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
})

const polly = new PollyClient({
  region: 'us-east-2',
  credentials: fromNodeProviderChain()
})

export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  const body = JSON.parse(event.body || '{}')
  const text = body.text || 'Hello from Amazon Polly!'
  const filename = body.filename || 'default.mp3'
  const bucket = process.env.AUDIO_OUTPUT_BUCKET || ''
  const voiceId = (process.env.POLLY_VOICE_ID || 'Joanna') as VoiceId
  const isLocal = process.env.LOCAL === 'true'

  if (isLocal) {
    const synthCommand = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId
    })
    const { AudioStream } = await polly.send(synthCommand)

    if (!AudioStream) {
      throw new Error('Polly returned empty AudioStream')
    }

    const arrayBuffer = await AudioStream.transformToByteArray()
    const buffer = Buffer.from(arrayBuffer)

    const outputDir = path.join(process.cwd(), 'audio')
    const outputPath = path.join(outputDir, filename)
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
    fs.writeFileSync(outputPath, buffer)

    console.log(`Audio saved locally: ${outputPath}`)
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'saved', path: outputPath })
    }
  }

  if (!bucket) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Missing AUDIO_OUTPUT_BUCKET env var' })
    }
  }

  try {
    const { url } = await uploadIfNotExists({
      bucketName: bucket,
      fileKey: `audio/${filename}`,
      text,
      voiceId,
    })

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ url })
    }
  } catch (err: any) {
    console.error(err)
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: err.message || 'Internal Server Error' })
    }
  }
}

if (require.main === module) {
  handler({ body: JSON.stringify({ text: 'Testing locally', filename: 'local.mp3' }) })
    .then(res => console.log(res))
    .catch(err => console.error(err))
}
