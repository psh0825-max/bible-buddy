export interface Quiz {
  storyId: string
  question: string
  type: 'ox' | 'multiple' | 'blank'
  options?: string[]
  answer: string | boolean
  blankWord?: string
}

export const quizzes: Quiz[] = [
  // 천지창조
  { storyId: 'creation', question: '하나님이 첫째 날에 만든 것은 빛이다', type: 'ox', answer: true },
  { storyId: 'creation', question: '하나님은 며칠 동안 세상을 만드셨나요?', type: 'multiple', options: ['5일', '6일', '7일', '10일'], answer: '6일' },
  { storyId: 'creation', question: '하나님이 다섯째 날에 만든 것은?', type: 'multiple', options: ['사람', '물고기와 새', '해와 달', '꽃과 나무'], answer: '물고기와 새' },
  { storyId: 'creation', question: '하나님이 만드신 첫 번째 사람의 이름은 ___이에요', type: 'blank', answer: '아담', blankWord: '아담' },
  { storyId: 'creation', question: '하나님은 일곱째 날에 일하셨다', type: 'ox', answer: false },
  // 노아의 방주
  { storyId: 'noah', question: '노아는 나쁜 사람이었다', type: 'ox', answer: false },
  { storyId: 'noah', question: '비가 며칠 동안 내렸나요?', type: 'multiple', options: ['7일', '20일', '40일', '100일'], answer: '40일' },
  { storyId: 'noah', question: '노아가 날려보낸 새는?', type: 'multiple', options: ['참새', '독수리', '비둘기', '까치'], answer: '비둘기' },
  { storyId: 'noah', question: '하나님이 보여주신 약속의 표시는 ___예요', type: 'blank', answer: '무지개', blankWord: '무지개' },
  { storyId: 'noah', question: '동물들은 한 마리씩 방주에 탔다', type: 'ox', answer: false },
  // 아브라함
  { storyId: 'abraham', question: '아브라함은 하나님을 믿지 않았다', type: 'ox', answer: false },
  { storyId: 'abraham', question: '아브라함의 아들 이름은?', type: 'multiple', options: ['모세', '다윗', '이삭', '야곱'], answer: '이삭' },
  { storyId: 'abraham', question: '아브라함의 아내 이름은?', type: 'multiple', options: ['마리아', '사라', '한나', '룻'], answer: '사라' },
  { storyId: 'abraham', question: '하나님이 아브라함의 자손이 하늘의 ___만큼 많아질 거라고 하셨어요', type: 'blank', answer: '별', blankWord: '별' },
  { storyId: 'abraham', question: '아브라함은 100살에 아들을 얻었다', type: 'ox', answer: true },
  // 아기 모세
  { storyId: 'moses', question: '모세의 엄마는 아기를 바구니에 넣었다', type: 'ox', answer: true },
  { storyId: 'moses', question: '아기 모세를 발견한 사람은?', type: 'multiple', options: ['바로 왕', '공주님', '군인', '어부'], answer: '공주님' },
  { storyId: 'moses', question: '모세라는 이름의 뜻은?', type: 'multiple', options: ['용감한 자', '물에서 건져낸 자', '하나님의 아들', '빛나는 자'], answer: '물에서 건져낸 자' },
  { storyId: 'moses', question: '모세의 누나 이름은 ___이에요', type: 'blank', answer: '미리암', blankWord: '미리암' },
  { storyId: 'moses', question: '바로 왕은 이스라엘 아기들을 사랑했다', type: 'ox', answer: false },
  // 다니엘
  { storyId: 'daniel', question: '다니엘은 기도를 멈추었다', type: 'ox', answer: false },
  { storyId: 'daniel', question: '다니엘은 하루에 몇 번 기도했나요?', type: 'multiple', options: ['1번', '2번', '3번', '5번'], answer: '3번' },
  { storyId: 'daniel', question: '다니엘이 들어간 곳은?', type: 'multiple', options: ['감옥', '사자굴', '동굴', '우물'], answer: '사자굴' },
  { storyId: 'daniel', question: '하나님이 ___를 보내서 사자의 입을 막으셨어요', type: 'blank', answer: '천사', blankWord: '천사' },
  { storyId: 'daniel', question: '왕은 다니엘을 사자굴에 넣고 싶었다', type: 'ox', answer: false },
  // 요나
  { storyId: 'jonah', question: '요나는 하나님 말씀에 순종했다', type: 'ox', answer: false },
  { storyId: 'jonah', question: '요나가 가야 했던 도시는?', type: 'multiple', options: ['예루살렘', '바빌론', '니느웨', '다시스'], answer: '니느웨' },
  { storyId: 'jonah', question: '요나는 물고기 배 속에 며칠 있었나요?', type: 'multiple', options: ['1일', '3일', '7일', '40일'], answer: '3일' },
  { storyId: 'jonah', question: '요나를 삼킨 것은 큰 ___예요', type: 'blank', answer: '물고기', blankWord: '물고기' },
  { storyId: 'jonah', question: '니느웨 사람들은 회개했다', type: 'ox', answer: true },
  // 다윗과 골리앗
  { storyId: 'david', question: '골리앗은 작은 사람이었다', type: 'ox', answer: false },
  { storyId: 'david', question: '다윗이 골리앗에게 던진 것은?', type: 'multiple', options: ['창', '화살', '돌', '칼'], answer: '돌' },
  { storyId: 'david', question: '다윗의 직업은?', type: 'multiple', options: ['군인', '목자', '어부', '왕'], answer: '목자' },
  { storyId: 'david', question: '다윗은 매끄러운 돌 ___개를 주웠어요', type: 'blank', answer: '다섯', blankWord: '다섯' },
  { storyId: 'david', question: '다윗은 나중에 이스라엘의 왕이 되었다', type: 'ox', answer: true },
  // 아기 예수
  { storyId: 'baby-jesus', question: '예수님은 궁전에서 태어나셨다', type: 'ox', answer: false },
  { storyId: 'baby-jesus', question: '예수님이 태어나신 곳은?', type: 'multiple', options: ['예루살렘', '베들레헴', '나사렛', '이집트'], answer: '베들레헴' },
  { storyId: 'baby-jesus', question: '천사가 기쁜 소식을 전한 사람은?', type: 'multiple', options: ['왕', '제사장', '목자들', '군인들'], answer: '목자들' },
  { storyId: 'baby-jesus', question: '아기 예수님은 ___에 누이셨어요', type: 'blank', answer: '구유', blankWord: '구유' },
  { storyId: 'baby-jesus', question: '동방박사들이 별을 따라왔다', type: 'ox', answer: true },
  // 잃어버린 양
  { storyId: 'lost-sheep', question: '목자에게 양이 천 마리 있었다', type: 'ox', answer: false },
  { storyId: 'lost-sheep', question: '목자의 양은 모두 몇 마리였나요?', type: 'multiple', options: ['50마리', '99마리', '100마리', '200마리'], answer: '100마리' },
  { storyId: 'lost-sheep', question: '목자는 잃어버린 양을 어떻게 데려왔나요?', type: 'multiple', options: ['끌고 왔어요', '어깨에 메고', '밧줄로 묶고', '쫓아왔어요'], answer: '어깨에 메고' },
  { storyId: 'lost-sheep', question: '목자는 ___마리를 안전한 곳에 두고 찾으러 갔어요', type: 'blank', answer: '아흔아홉', blankWord: '아흔아홉' },
  { storyId: 'lost-sheep', question: '잃어버린 양 이야기는 예수님이 하신 비유이다', type: 'ox', answer: true },
  // 오병이어
  { storyId: 'five-loaves', question: '예수님 앞에 모인 사람은 5,000명이다', type: 'ox', answer: true },
  { storyId: 'five-loaves', question: '음식을 가져온 사람은?', type: 'multiple', options: ['베드로', '요한', '어린이', '여자'], answer: '어린이' },
  { storyId: 'five-loaves', question: '보리떡은 몇 개였나요?', type: 'multiple', options: ['2개', '3개', '5개', '7개'], answer: '5개' },
  { storyId: 'five-loaves', question: '남은 음식을 모으니 ___바구니였어요', type: 'blank', answer: '열두', blankWord: '열두' },
  { storyId: 'five-loaves', question: '물고기는 세 마리였다', type: 'ox', answer: false },
  // 폭풍
  { storyId: 'storm', question: '예수님은 배 위에서 주무셨다', type: 'ox', answer: true },
  { storyId: 'storm', question: '예수님이 바다에게 뭐라고 하셨나요?', type: 'multiple', options: ['멈춰라!', '잠잠하라!', '물러가라!', '조용해라!'], answer: '잠잠하라!' },
  { storyId: 'storm', question: '폭풍이 치자 제자들은?', type: 'multiple', options: ['기도했어요', '무서워했어요', '노래했어요', '잤어요'], answer: '무서워했어요' },
  { storyId: 'storm', question: '예수님이 말씀하시자 바다가 ___해졌어요', type: 'blank', answer: '잔잔', blankWord: '잔잔' },
  { storyId: 'storm', question: '제자들이 예수님을 깨웠다', type: 'ox', answer: true },
  // 부활
  { storyId: 'resurrection', question: '예수님은 사흘 만에 살아나셨다', type: 'ox', answer: true },
  { storyId: 'resurrection', question: '무덤에서 돌이 굴려진 것을 처음 본 사람은?', type: 'multiple', options: ['군인들', '베드로', '여자들', '제사장'], answer: '여자들' },
  { storyId: 'resurrection', question: '무덤 앞에 누가 있었나요?', type: 'multiple', options: ['군인', '천사', '제자', '목자'], answer: '천사' },
  { storyId: 'resurrection', question: '예수님이 다시 살아나신 것을 ___이라고 해요', type: 'blank', answer: '부활', blankWord: '부활' },
  { storyId: 'resurrection', question: '예수님의 무덤은 비어 있었다', type: 'ox', answer: true },
]
