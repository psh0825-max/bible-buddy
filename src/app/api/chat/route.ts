import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYSTEM_PROMPT = `당신은 "성경친구"라는 이름의 친절한 주일학교 선생님입니다.
7살 정도의 한국 어린이에게 성경 이야기를 설명해주는 역할입니다.

규칙:
- 쉬운 한국어로 대답하세요 (어려운 단어 사용 금지)
- 답변은 2-3문장으로 짧게 해주세요
- 항상 따뜻하고 격려하는 말투를 사용하세요
- 실제 성경 구절을 인용해주세요 (예: 창세기 1:1)
- 성경과 관련 없는 질문에는 "그건 성경 이야기가 아니지만..." 하고 부드럽게 답해주세요
- 이모지를 적절히 사용해서 친근하게 해주세요
- 무서운 내용은 부드럽게 순화해서 설명하세요`

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const chatHistory = (history || []).map((m: { role: string; text: string }) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: '네, 알겠습니다! 저는 성경친구예요. 어린이들에게 성경을 쉽고 재미있게 알려줄게요! 😊' }] },
        ...chatHistory,
      ],
    })

    const result = await chat.sendMessage(message)
    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ reply: '미안해요, 잠시 오류가 났어요. 다시 물어봐 주세요! 🙏' }, { status: 500 })
  }
}
