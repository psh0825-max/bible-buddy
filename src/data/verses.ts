export interface Verse {
  id: string
  text: string
  reference: string
  category: '사랑' | '믿음' | '용기' | '감사' | '기도'
  difficulty: 1 | 2 | 3
}

export const verses: Verse[] = [
  // 사랑
  { id: 'v1', text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니', reference: '요한복음 3:16', category: '사랑', difficulty: 1 },
  { id: 'v2', text: '내가 너희에게 새 계명을 주노니 서로 사랑하라', reference: '요한복음 13:34', category: '사랑', difficulty: 1 },
  { id: 'v3', text: '사랑은 오래 참고 사랑은 온유하며', reference: '고린도전서 13:4', category: '사랑', difficulty: 2 },
  { id: 'v4', text: '우리가 사랑함은 그가 먼저 우리를 사랑하셨음이라', reference: '요한일서 4:19', category: '사랑', difficulty: 1 },
  { id: 'v5', text: '너희는 서로 사랑하라 내가 너희를 사랑한 것 같이', reference: '요한복음 15:12', category: '사랑', difficulty: 2 },
  { id: 'v6', text: '사랑 안에 두려움이 없고 온전한 사랑이 두려움을 내쫓나니', reference: '요한일서 4:18', category: '사랑', difficulty: 3 },
  // 믿음
  { id: 'v7', text: '태초에 하나님이 천지를 창조하시니라', reference: '창세기 1:1', category: '믿음', difficulty: 1 },
  { id: 'v8', text: '여호와는 나의 목자시니 내게 부족함이 없으리로다', reference: '시편 23:1', category: '믿음', difficulty: 1 },
  { id: 'v9', text: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라', reference: '잠언 3:5', category: '믿음', difficulty: 2 },
  { id: 'v10', text: '믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니', reference: '히브리서 11:1', category: '믿음', difficulty: 3 },
  { id: 'v11', text: '나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라', reference: '빌립보서 4:19', category: '믿음', difficulty: 3 },
  { id: 'v12', text: '예수께서 이르시되 나는 길이요 진리요 생명이니', reference: '요한복음 14:6', category: '믿음', difficulty: 1 },
  // 용기
  { id: 'v13', text: '강하고 담대하라 두려워하지 말며 놀라지 말라', reference: '여호수아 1:9', category: '용기', difficulty: 1 },
  { id: 'v14', text: '여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요', reference: '시편 27:1', category: '용기', difficulty: 2 },
  { id: 'v15', text: '두려워하지 말라 내가 너와 함께 함이라', reference: '이사야 41:10', category: '용기', difficulty: 1 },
  { id: 'v16', text: '내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은', reference: '시편 23:4', category: '용기', difficulty: 2 },
  { id: 'v17', text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라', reference: '빌립보서 4:13', category: '용기', difficulty: 2 },
  { id: 'v18', text: '하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 능력과 사랑과 절제의 마음이니', reference: '디모데후서 1:7', category: '용기', difficulty: 3 },
  // 감사
  { id: 'v19', text: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라', reference: '데살로니가전서 5:16-18', category: '감사', difficulty: 1 },
  { id: 'v20', text: '여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다', reference: '시편 107:1', category: '감사', difficulty: 1 },
  { id: 'v21', text: '이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라', reference: '데살로니가전서 5:18', category: '감사', difficulty: 2 },
  { id: 'v22', text: '여호와를 찬양하라 내 영혼아 그의 모든 은택을 잊지 말지어다', reference: '시편 103:2', category: '감사', difficulty: 2 },
  { id: 'v23', text: '감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가라', reference: '시편 100:4', category: '감사', difficulty: 2 },
  { id: 'v24', text: '아무것도 염려하지 말고 다만 모든 일에 기도와 간구로 감사함으로', reference: '빌립보서 4:6', category: '감사', difficulty: 3 },
  // 기도
  { id: 'v25', text: '너희가 내 이름으로 무엇이든지 내게 구하면 내가 행하리라', reference: '요한복음 14:14', category: '기도', difficulty: 1 },
  { id: 'v26', text: '구하라 그리하면 너희에게 주실 것이요', reference: '마태복음 7:7', category: '기도', difficulty: 1 },
  { id: 'v27', text: '쉬지 말고 기도하라', reference: '데살로니가전서 5:17', category: '기도', difficulty: 1 },
  { id: 'v28', text: '나를 부르라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 네게 보이리라', reference: '예레미야 33:3', category: '기도', difficulty: 3 },
  { id: 'v29', text: '여호와를 가까이 하라 그리하면 너희를 가까이 하시리라', reference: '야고보서 4:8', category: '기도', difficulty: 2 },
  { id: 'v30', text: '하늘에 계신 우리 아버지여 이름이 거룩히 여김을 받으시오며', reference: '마태복음 6:9', category: '기도', difficulty: 2 },
]
