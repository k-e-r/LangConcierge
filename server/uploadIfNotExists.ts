import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { OutputFormat, PollyClient, SynthesizeSpeechCommand, VoiceId } from '@aws-sdk/client-polly'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

const s3 = new S3Client({
  region: 'us-east-2',
  credentials: fromNodeProviderChain()
})
const polly = new PollyClient({ region: 'us-east-2', credentials: fromNodeProviderChain() })

interface UploadParams {
  bucketName: string
  fileKey: string
  text: string
  voiceId?: VoiceId
  outputFormat?: OutputFormat
}

interface UploadResult {
  status: 'skipped' | 'uploaded'
  url: string
}

export const uploadIfNotExists = async ({
  bucketName,
  fileKey,
  text,
  voiceId = 'Joanna',
  outputFormat = 'mp3'
}: UploadParams): Promise<UploadResult> => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: fileKey }))
    console.log(`File already exists: ${fileKey}`)

    return {
      status: 'skipped',
      url: `https://${bucketName}.s3.amazonaws.com/${fileKey}`
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'NotFound') {
      const synthCommand = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: outputFormat,
        VoiceId: voiceId
      })
      const { AudioStream } = await polly.send(synthCommand)

      if (!AudioStream) {
        throw new Error('Polly returned empty AudioStream')
      }

      const arrayBuffer = await AudioStream.transformToByteArray()

      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: Buffer.from(arrayBuffer),
        ContentType: 'audio/mpeg',
        ACL: 'public-read',
      }))

      console.log(`Uploaded new file: ${fileKey}`)
      return {
        status: 'uploaded',
        url: `https://${bucketName}.s3.amazonaws.com/${fileKey}`
      }
    } else {
      throw error
    }
  }
}
