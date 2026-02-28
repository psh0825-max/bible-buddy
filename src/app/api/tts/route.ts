import { NextRequest, NextResponse } from 'next/server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

const client = new TextToSpeechClient()

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || text.length > 3000) {
      return NextResponse.json({ error: 'Invalid text' }, { status: 400 })
    }

    // SSML: 구두점에 쉼 추가 (어린이용이라 더 느리게)
    const ssml = '<speak>' + text
      .replace(/\. /g, '.<break time="600ms"/> ')
      .replace(/\, /g, ',<break time="350ms"/> ')
      .replace(/\? /g, '?<break time="600ms"/> ')
      .replace(/\! /g, '!<break time="500ms"/> ')
      .replace(/\n/g, '<break time="700ms"/>')
      + '</speak>'

    const [response] = await client.synthesizeSpeech({
      input: { ssml },
      voice: {
        languageCode: 'ko-KR',
        name: 'ko-KR-Wavenet-B', // 여성, 따뜻한 톤 (어린이 앱)
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.8, // 어린이용 느린 속도
        pitch: 1.0, // 살짝 높은 톤 (친근한 느낌)
      },
    })

    if (!response.audioContent) {
      return NextResponse.json({ error: 'No audio' }, { status: 500 })
    }

    const audioBuffer = Buffer.from(response.audioContent as Uint8Array)
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (e: unknown) {
    console.error('TTS error:', e)
    const msg = e instanceof Error ? e.message : 'TTS failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
