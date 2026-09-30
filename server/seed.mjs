export const initialSettings = {
  travelCards: [{"image": "/images/surya/travel-mirror-original.png", "location": "Mumbai, India", "caption": "Same me, stronger every day."}, {"image": "/images/surya/surya-seaside.jpeg", "location": "Goa, India", "caption": "Vitamin sea & bigger dreams."}, {"image": "/images/surya/travel-city.jpeg", "location": "Almaty, Kazakhstan", "caption": "Different places. Same goals."}, {"image": "/images/surya/travel-garden.jpeg", "location": "Jim Corbett Park, India", "caption": "Fresh air. Clearer thoughts."}, {"image": "/images/surya/surya-portrait-natural.jpeg", "location": "Phuket, Thailand", "caption": "Make room for yourself."}, {"image": "/images/surya/hero-outdoor-original.jpeg", "location": "Mumbai, India", "caption": "A little joy along the way."}, {"image": "/images/surya/travel-cafe.jpeg", "location": "Somewhere happy", "caption": "Good moments. A fuller life."}],
  brand: "Train with Surya",
  tagline: "Stronger every day. With Surya.",
  email: "surya737singh@gmail.com",
  whatsapp: "918299375609",
  location: "",
  instagram: "https://www.instagram.com/surya.singhhhh/",
  facebook: "https://www.facebook.com/surya.singh.928762",
  portrait: "/images/surya/coach-blue.webp",
  heroImage: "/images/surya/hero-selected.png",
  heroVideo: "",
  thirdHeroImage: "/images/surya/hero-lifestyle-olive.webp",
  secondHeroImage: "/images/surya/hero-outdoor-original.jpeg",
  logoImage: "/images/brand/surya-logo-light.png",
  footerLogoImage: "/images/brand/surya-logo-white.png",
  coachImage: "/images/surya/coach-blue.webp",
  visualTheme: "slate-blue-reference-2026-09-29",
  hero: [
    {
      eyebrow: "FITNESS  •  NUTRITION  •  MINDSET  •  LIFESTYLE",
      title: "Stronger\nHealthier\nHappier You.",
      text: "Personal training, practical nutrition guidance and a plan built around your life. Let’s make your next chapter a strong one.",
      cta: "Explore Programmes",
      href: "/programmes",
    },
{
  "eyebrow": "FITNESS  \u2022  NUTRITION  \u2022  MINDSET  \u2022  LIFESTYLE",
  "title": "Stronger\nHealthier\nHappier You.",
  "text": "Real training. Practical nutrition. A lifestyle you can actually follow. Let\u2019s make your next chapter a stronger one.",
  "cta": "Explore Programmes",
  "href": "/programmes"
},
    {
      eyebrow: "CONFIDENCE  •  BALANCE  •  EVERYDAY JOY",
      title: "Feel good.\nLive fully.\nBe yourself.",
      text: "Build strength for the life you love. Simple movement, balanced nutrition and personal support to help you feel confident in your own skin.",
      cta: "Find Your Balance",
      href: "/programmes",
    },
  ],
  aboutTitle: "She knows what\nstarting feels like.",
  aboutText:
    "Surya’s approach to coaching starts with understanding. Her own fitness journey taught her the value of showing up, building confidence and making progress one step at a time. Now she brings that personal perspective to every coaching conversation.",
  sections: [
    {
      id: "programmes",
      title: "A little direction.\nA stronger you.",
      subtitle:
        "There is more than one way to move forward. Find the support that works for you.",
      enabled: true,
    },
    {
      id: "about",
      title: "She knows what\nstarting feels like.",
      subtitle: "A coach who understands the journey.",
      enabled: true,
    },
    {
      id: "method",
      title: "Big changes start\nwith small steps.",
      subtitle: "No guessing. No going it alone. Just a clear path forward.",
      enabled: true,
    },
    {
      id: "transformations",
      title: "Progress looks\ndifferent on everyone.",
      subtitle:
        "Strength, confidence, consistency. Your story is more than a number.",
      enabled: true,
    },
    {
      id: "journal",
      title: "A little knowledge.\nA lot of possibility.",
      subtitle: "Thoughtful reads for a stronger everyday.",
      enabled: true,
    },
    {
      id: "social",
      title: "Life beyond\nthe workout.",
      subtitle: "Follow the moments, movement and mindset behind the coaching.",
      enabled: true,
    },
  ],
  consultationMinutes: 30,
  bufferMinutes: 15,
  cancellationHours: 24,
  reminderHours: 24,
  bookingMode: "request",
  popupEnabled: false,
  popupDelay: 35,
  privacyContact: "",
  seoTitle: "Train With Surya — Your Stronger Chapter",
  seoDescription:
    "Personal training, online coaching, home workouts and practical nutrition support with Surya Singh.",
  finderRules: [
    {
      field: "goal",
      value: "Weight management",
      programme: "weight-management",
    },
    { field: "location", value: "Home", programme: "home-workouts" },
    { field: "format", value: "Online coaching", programme: "online-coaching" },
    {
      field: "goal",
      value: "Nutrition habits",
      programme: "nutrition-support",
    },
  ],
};
export const programmes = [
  {
    id: "personal-training",
    title: "One-to-one\npersonal training",
    category: "One-to-One",
    label: "FOCUS ON YOU",
    summary: "Your goals. Your pace. Your coach, right beside you.",
    description:
      "Individual attention, thoughtful progression and coaching that begins with understanding your starting point. Explore a personal training approach built around your goals and experience.",
    inclusions: [
      "Personal goal-setting conversation",
      "Technique-focused coaching",
      "An individual training approach",
      "Progress reviews and adjustments",
    ],
    suitable: "People who value individual guidance and feedback.",
    mode: "In-person, subject to confirmed location",
    equipment: "Discuss during your consultation",
    price: null,
    duration: "Discuss with Surya",
    frequency: "Personalised after consultation",
    support: "Agreed with your coach before enrolment",
    status: "published",
    order: 1,
    icon: "dumbbell",
    color: "sage",
    faq: [
      {
        question: "Where are sessions held?",
        answer:
          "Enquire to confirm current training locations and availability.",
      },
    ],
  },
  {
    id: "online-coaching",
    title: "Online\npersonal coaching",
    category: "Online",
    label: "YOUR COACH, WHEREVER YOU ARE",
    summary: "A clear plan and genuine support, wherever life takes you.",
    description:
      "Bring structure to your training with remote coaching, exercise guidance and check-ins. Your programme and support schedule are agreed together before you start.",
    inclusions: [
      "Initial coaching conversation",
      "Individual workout schedule",
      "Exercise guidance",
      "Scheduled progress check-ins",
    ],
    suitable: "Busy people who want guidance with flexibility.",
    mode: "Online",
    equipment: "Adapted to your available equipment",
    price: null,
    duration: "Discuss with Surya",
    frequency: "Agreed before enrolment",
    support: "Check-in schedule confirmed before enrolment",
    status: "published",
    order: 2,
    icon: "monitor",
    color: "cream",
    faq: [
      {
        question: "Are live video sessions included?",
        answer:
          "Ask Surya about available formats. Live sessions are included only when specified in your selected plan.",
      },
    ],
  },
  {
    id: "home-workouts",
    title: "Home-based\nworkouts",
    category: "At Home",
    label: "YOUR SPACE. YOUR STRENGTH.",
    summary: "Make room for movement. Start right where you are.",
    description:
      "Explore a practical routine around your space, schedule and available equipment. Get a clear starting point and guidance as you build consistency.",
    inclusions: [
      "Equipment and space assessment",
      "A routine that fits your available time",
      "Exercise alternatives",
      "Coach-reviewed progression",
    ],
    suitable: "Beginners and anyone who prefers training at home.",
    mode: "At home with remote guidance",
    equipment: "Bodyweight or available home equipment",
    price: null,
    duration: "Discuss with Surya",
    frequency: "Personalised after consultation",
    support: "Agreed before enrolment",
    status: "published",
    order: 3,
    icon: "home",
    color: "peach",
    faq: [],
  },
  {
    id: "weight-management",
    title: "Sustainable\nweight management",
    category: "Weight Management",
    label: "PROGRESS, WITHOUT THE PRESSURE",
    summary: "Build habits for your life, not just a moment on the scales.",
    description:
      "Work towards your goals through consistent movement, strength training and practical habits. Progress is individual, and your starting point matters.",
    inclusions: [
      "Personal goal discussion",
      "Structured movement and strength work",
      "Habit-focused support",
      "Regular progress conversations",
    ],
    suitable: "People seeking a consistent and supportive approach.",
    mode: "Discuss online or personal coaching",
    equipment: "Adapted to your programme",
    price: null,
    duration: "Discuss with Surya",
    frequency: "Personalised after consultation",
    support: "Agreed before enrolment",
    status: "published",
    order: 4,
    icon: "activity",
    color: "sage",
    faq: [
      {
        question: "Is weight loss guaranteed?",
        answer:
          "No. Results vary with individual circumstances, consistency and other factors. We agree realistic goals together.",
      },
    ],
  },
  {
    id: "nutrition-support",
    title: "Nutrition &\ndiet-chart support",
    category: "Nutrition",
    label: "EVERYDAY FOOD. PRACTICAL HABITS.",
    summary: "Guidance that makes room for your preferences and real life.",
    description:
      "Discuss everyday eating habits, preferences and a practical approach with Surya. Personalised nutrition services are offered within the coach’s verified scope; medical dietary needs require an appropriately qualified professional.",
    inclusions: [
      "Food and lifestyle preferences",
      "Practical meal-planning discussion",
      "Meal options and substitutions within scope",
      "Coach-reviewed adjustments",
    ],
    suitable: "People looking for practical everyday nutrition support.",
    mode: "Personal consultation",
    equipment: "No equipment needed",
    price: null,
    duration: "Discuss with Surya",
    frequency: "Agreed before enrolment",
    support: "Professional scope confirmed before assignment",
    status: "published",
    order: 5,
    icon: "leaf",
    color: "cream",
    faq: [],
  },
];
export const draftArticles = [
  {
    id: "morning-detox-gut-health",
    title: "Morning Detox & Metabolism: 5 Time-Tested Home Remedies for a Healthier Gut",
    titleHi: "सुबह का डिटॉक्स और मेटाबॉलिज्म: बेहतर गट हेल्थ के लिए 5 आसान घरेलू नुस्खे",
    status: "published",
    category: "Home Remedies",
    excerpt: "Jumpstart your metabolism and soothe digestive discomfort with simple morning rituals using kitchen ingredients like warm jeera water, ginger, and fresh lemon.",
    body: `Your morning routine sets the tone for your digestive system and overall vitality throughout the day. In traditional wellness and Ayurvedic practice, supporting your digestive fire (Agni) early in the morning helps clear accumulated waste, improves nutrient absorption, and stabilizes energy levels.

1. Warm Jeera-Ajwain Infusion
Boil half a teaspoon of cumin seeds (jeera) and carom seeds (ajwain) in two cups of water until reduced by half. Strain and sip warm. Jeera stimulates pancreatic enzymes, while thymol in ajwain relieves morning bloating and sluggish digestion.

2. Fresh Ginger & Lemon Elixir
A small slice of freshly crushed ginger steeped in warm water with a squeeze of fresh lemon acts as an anti-inflammatory tonic. Ginger contains gingerols that enhance gastric motility and prevent sluggish morning digestion.

3. Soaked Methi (Fenugreek) Water
Soaking a teaspoon of fenugreek seeds overnight in water and drinking it first thing in the morning provides soluble fiber, helping regulate morning blood sugar spikes and easing regular bowel movements.

4. Raw Amla Shot with Warm Water
Rich in natural Vitamin C and bioflavonoids, freshly squeezed amla juice or pure organic amla powder mixed in lukewarm water strengthens the gut lining, supports liver detoxification, and gives a clean metabolic boost.

5. Gentle Morning Hydration with Rock Salt
Before reaching for caffeine, drink two glasses of lukewarm water with a tiny pinch of Himalayan pink rock salt. This replenishes electrolytes lost overnight and kickstarts cellular hydration.

Small daily habits create profound long-term changes. Choose one or two remedies that fit seamlessly into your morning routine and stay consistent for at least three weeks to feel the difference.`,
    bodyHi: `आपकी सुबह की शुरुआत यह तय करती है कि आपका पाचन तंत्र और ऊर्जा का स्तर पूरे दिन कैसा रहेगा। पारंपरिक आयुर्वेद के अनुसार, सुबह सबसे पहले अपनी जठराग्नि (पाचन अग्नि) को सक्रिय करने से शरीर से टॉक्सिन्स बाहर निकलते हैं और मेटाबॉलिज्म तेज होता है।

1. गुनगुना जीरा-अजवाइन पानी
दो कप पानी में आधा चम्मच जीरा और आधा चम्मच अजवाइन डालकर आधा रह जाने तक उबालें। इसे छानकर गुनगुना पिएं। जीरा पाचक एंजाइमों को उत्तेजित करता है और अजवाइन सुबह की गैस और भारीपन को तुरंत शांत करती है।

2. अदरक और नींबू का काढ़ा
ताजा अदरक का एक छोटा टुकड़ा कूटकर गुनगुने पानी में उबालें और आधा नींबू निचोड़ें। अदरक में मौजूद जिंजरोल सूजन कम करने और पाचन क्रिया को सक्रिय करने में मदद करता है।

3. रात भर भीगे मेथी का पानी
एक चम्मच मेथी दाना रात भर पानी में भिगोएं और सुबह खाली पेट इसका पानी पिएं। इसमें मौजूद घुलनशील फाइबर ब्लड शुगर को नियंत्रित करता है और कब्ज से राहत देता है।

4. ताजा आंवला रस
विटामिन सी और एंटीऑक्सीडेंट्स से भरपूर आंवला पेट की अंदरूनी परत को मजबूत करता है और लिवर की कार्यक्षमता को बढ़ाता है।

5. सेंधा नमक के साथ गुनगुना पानी
चाय या कॉफी से पहले दो गिलास गुनगुने पानी में एक चुटकी सेंधा नमक मिलाकर पिएं। यह शरीर के इलेक्ट्रोलाइट्स को रीस्टोर करता है।`,
    image: "/images/blog/blog-1-gut-health.jpg",
    author: "Surya Singh",
    publishedAt: "2026-09-12T08:30:00.000Z",
    readTime: "4 min read",
    order: 0,
  },
  {
    id: "home-strength-workout-guide",
    title: "Strength Training at Home: Zero-Equipment Workouts to Build Lean Muscle",
    titleHi: "घर पर स्ट्रेंथ ट्रेनिंग: बिना किसी इक्विपमेंट के लीन बॉडी और मसल बनाने का तरीका",
    status: "published",
    category: "Fitness & Movement",
    excerpt: "You don't need an expensive gym membership to build functional strength. Learn how bodyweight tempo, progressive holds, and smart circuits create transformative results.",
    body: `Many people believe that building strength requires heavy barbells and fancy gym machines. While external weights are effective, your own bodyweight offers an incredible stimulus when you understand mechanical leverage, tempo control, and progressive overload.

The Power of Time Under Tension
Instead of rushing through push-ups or squats, slow down each repetition. Lowering yourself for three seconds, pausing for one second at the bottom, and rising with control recruits deep motor units and stimulates lean muscle growth just as effectively as light dumbbells.

Core Compound Movements:
- Tempo Squats & Bulgarian Split Squats: Build strong glutes, quadriceps, and joint resilience. Elevate your rear foot on a sofa or chair for an intense single-leg challenge.
- Push-Up Progressions: Start on an incline (hands on a wall or sturdy table), advance to standard floor push-ups, and progress to slow eccentric push-ups to build chest and shoulder strength.
- Glute Bridges & Single-Leg Lifts: Strengthen the posterior chain, protect your lower back, and improve posture after long hours of sitting.
- Hollow Body Holds & Bird-Dogs: Develop deep abdominal bracing and spinal stability without straining your neck.

Sample 20-Minute Home Circuit:
Perform each movement for 40 seconds of focused work followed by 20 seconds of rest. Complete 3 to 4 rounds:
1. Tempo Bodyweight Squats (3 sec down, 1 sec hold)
2. Incline or Standard Push-ups
3. Single-Leg Glute Bridges (alternating legs)
4. Reverse Lunges with Thoracic Twist
5. Plank with Shoulder Taps

Consistency trumps intensity every time. Committing to 20 minutes of structured bodyweight training three to four times a week will dramatically improve your energy, body composition, and functional daily strength.`,
    bodyHi: `अक्सर लोगों को लगता है कि मजबूत और फिट बनने के लिए जिम की भारी मशीनें ही जरूरी हैं। लेकिन जब आप अपने शरीर के वजन (Bodyweight) का सही उपयोग करना सीखते हैं, तो आप घर पर भी लीन और टोन बॉडी आसानी से बना सकते हैं।

टाइम अंडर टेंशन (Time Under Tension) का महत्व:
कसरत करते समय जल्दबाजी करने के बजाय हर रैप को धीमा करें। उदाहरण के लिए, स्क्वाट करते समय 3 सेकंड नीचे जाने में लगाएं और 1 सेकंड नीचे रुकें। इससे मांसपेशियां पूरी तरह सक्रिय होती हैं।

मुख्य व्यायाम:
- टेम्पो स्क्वाट्स और स्प्लिट स्क्वाट्स: जांघों और हिप्स की मजबूती के लिए।
- पुश-अप्स के वेरिएशन्स: दीवार के सहारे, घुटने टेककर या सीधे फर्श पर।
- ग्लूट ब्रिजेस: पीठ के निचले हिस्से और हिप्स को मजबूत करने के लिए।
- प्लैंक और बर्ड-डॉग: पेट की अंदरूनी मांसपेशियों और कोर स्ट्रेंथ के लिए।

20 मिनट का आसान होम रूटीन:
हर एक्सरसाइज को 40 सेकंड करें और 20 सेकंड आराम करें। 3 से 4 राउंड्स पूरे करें:
1. धीमे बॉडीवेट स्क्वाट्स
2. पुश-अप्स
3. ग्लूट ब्रिजेस
4. रिवर्स लंज
5. प्लैंक होल्ड

हफ्ते में 3 से 4 दिन सिर्फ 20 मिनट का अभ्यास आपके शरीर में सकारात्मक बदलाव लाएगा।`,
    image: "/images/blog/blog-2-home-strength.jpg",
    author: "Surya Singh",
    publishedAt: "2026-09-16T10:00:00.000Z",
    readTime: "5 min read",
    order: 1,
  },
  {
    id: "kitchen-remedies-joint-pain-recovery",
    title: "Natural Kitchen Remedies for Joint Stiffness, Muscle Soreness & Fast Recovery",
    titleHi: "जोड़ों के दर्द और मांसपेशियों की रिकवरी के लिए किचन के प्राकृतिक घरेलू नुस्खे",
    status: "published",
    category: "Home Remedies",
    excerpt: "From golden turmeric-pepper milk to warm sesame oil massages, explore powerful anti-inflammatory remedies found right in your kitchen cabinet.",
    body: `Whether you are recovering from an intense workout or dealing with morning stiffness and joint fatigue, turning to natural anti-inflammatory remedies can accelerate tissue repair and soothe inflammation without harsh side effects.

1. Golden Milk (Haldi Doodh) with Black Pepper
Turmeric's active compound, curcumin, is one of the most potent natural anti-inflammatories known to science. However, curcumin has low bioavailability on its own. Adding freshly cracked black pepper (piperine) increases curcumin absorption by up to 2000%. Simmer half a teaspoon of organic turmeric, a pinch of black pepper, and a dash of cinnamon in warm almond or cow's milk before bedtime.

2. Warm Sesame Oil (Til Ka Tel) Abhyanga
Sesame oil is deeply penetrating and traditionally revered for pacifying Vata-related joint dryness and stiffness. Gently warming pure cold-pressed sesame oil and massaging knees, shoulders, and wrists before a warm bath lubricates joints and improves micro-circulation.

3. Dry Ginger (Sonth) and Fenugreek Powder
Mix equal parts of dry ginger powder (sonth) and roasted fenugreek powder (methi). Consuming half a teaspoon with warm water every morning reduces systemic inflammation and eases joint discomfort caused by cold weather or heavy training.

4. Mustard Oil & Garlic Warm Compress
Heating cold-pressed mustard oil with three to four crushed cloves of garlic until lightly browned creates an aromatic rub. Massaging this over tired back muscles or sore knee joints brings instant warmth, improves blood flow, and disperses lactic acid.

5. Hydration and Natural Electrolytes
Chronic muscle soreness is frequently worsened by low electrolyte balance. Sip coconut water or water with a slice of cucumber and lemon throughout the day to keep fascia and muscle fibers supple.

Listen to your body. Combine these home remedies with gentle joint mobility drills and proper recovery sleep for long-lasting joint vitality.`,
    bodyHi: `चाहे वर्कआउट के बाद मांसपेशियों में खिंचाव हो या उम्र के साथ जोड़ों में जकड़न, हमारी भारतीय रसोई में सूजन और दर्द को कम करने के कई अचूक उपाय मौजूद हैं।

1. काली मिर्च के साथ हल्दी वाला दूध (गोल्डन मिल्क):
हल्दी में मौजूद करक्यूमिन प्राकृतिक एंटी-इंफ्लेमेटरी है। काली मिर्च की एक चुटकी इसके अवशोषण को 2000% तक बढ़ा देती है। रात को सोने से पहले आधा चम्मच हल्दी और काली मिर्च दूध में उबालकर पिएं।

2. तिल के तेल से जोड़ों की मालिश:
हल्का गुनगुना तिल का तेल जोड़ों के रूखेपन और अकड़न को दूर करता है। नहाने से पहले घुटनों और कंधों की मालिश करने से रक्त संचार तेज होता है।

3. सोंठ और मेथी दाना चूर्ण:
सोंठ (सूखा अदरक) और भुनी हुई मेथी का चूर्ण बराबर मात्रा में मिलाकर सुबह गुनगुने पानी से लेने से जोड़ों के दर्द में बहुत आराम मिलता है।

4. लहसुन और सरसों के तेल की मालिश:
सरसों के तेल में 3-4 कली लहसुन पकाकर तैयार किया गया तेल मांसपेशियों के दर्द और जकड़न को तुरंत शांत करता है।

5. प्राकृतिक इलेक्ट्रोलाइट्स और पानी:
शरीर में पानी और मिनरल्स की कमी से मांसपेशियों में दर्द बढ़ता है। नारियल पानी और नींबू पानी का नियमित सेवन करें।`,
    image: "/images/blog/blog-3-joint-recovery.jpg",
    author: "Surya Singh",
    publishedAt: "2026-09-20T09:15:00.000Z",
    readTime: "5 min read",
    order: 2,
  },
  {
    id: "high-protein-indian-vegetarian-thali",
    title: "The Balanced Indian Thali: High-Protein Vegetarian Meal Planning for Fat Loss",
    titleHi: "संतुलित भारतीय थाली: फैट लॉस के लिए हाई-प्रोटीन शाकाहारी डाइट प्लान",
    status: "published",
    category: "Nutrition",
    excerpt: "How to balance traditional Indian home meals for sustainable fat loss without cutting out roti or dal. Smart protein pairing and portion control made effortless.",
    body: `A common myth in fitness is that traditional Indian vegetarian food is inherently too high in carbohydrates and lacking in protein. The truth is that an authentic Indian thali is a nutritional masterpiece when portioned and paired with intention.

The Golden Rule of Thali Composition
Instead of filling half your plate with rice and multiple chapatis, restructure your visual proportions:
- 50% Fiber: Fresh seasonal vegetables, cucumber, radish, and raw leafy salads with a dash of lemon juice.
- 25% Protein: Low-fat paneer, sprouted moong, cooked chickpeas (chana), tofu, or high-protein thick dal.
- 25% Complex Carbohydrates: One or two multi-grain or jowar/bajra rotis, or half a cup of unpolished brown/red rice.

Smart Protein Combining:
- Lentils + Grains: Legumes like dal are rich in lysine but limited in methionine; whole grains are rich in methionine but lower in lysine. Eating them together creates a complete amino acid profile.
- Sprouting Boost: Sprouting moong, black chana, and lobia increases bioavailable protein, enzymes, and vitamin content while drastically reducing bloating.
- Quality Paneer & Curd: Including 100 grams of fresh homemade paneer or a bowl of probiotic-rich hung curd adds 15 to 18 grams of high-quality protein per meal.

Meal Sequencing for Stable Blood Sugar:
Always eat your fiber (salad) first, followed by your protein sources, and finish with your carbohydrates. This simple sequencing blunts glucose spikes, keeps insulin steady, and eliminates post-lunch lethargy.

You do not need to abandon the foods of your culture to achieve a strong, lean, and energetic physique. Sustainable fitness is about balance and awareness.`,
    bodyHi: `फिटनेस की दुनिया में यह भ्रम फैला है कि शाकाहारी भारतीय खाने से वजन कम नहीं किया जा सकता। सच यह है कि सही अनुपात में खाई गई भारतीय थाली पोषण का सबसे संतुलित स्रोत है।

थाली का सही अनुपात (Plate Method):
- 50% फाइबर: ताजी हरी सब्जियां, ककड़ी, गाजर और नींबू के साथ सलाद।
- 25% प्रोटीन: पनीर, उबले चने, राजमा, सोयाबीन या अंकुरित मूंग।
- 25% कॉम्प्लेक्स कार्ब्स: 1-2 मल्टीग्रेन या बाजरा/ज्वार की रोटी, या थोड़ा भूरा चावल।

प्रोटीन बढ़ाने के आसान तरीके:
- दाल और अनाज का मेल: दाल और चावल/रोटी साथ खाने से शरीर को सभी जरूरी अमीनो एसिड्स मिलते हैं।
- अंकुरित अनाज (Sprouts): मूंग और चने को अंकुरित करने से उनका प्रोटीन और विटामिन बढ़ जाता है।
- ताजा दही और पनीर: भोजन में 100 ग्राम पनीर या एक कटोरी गाढ़ा दही शामिल करें।

खाने का सही क्रम:
पहले सलाद खाएं, फिर दाल/पनीर, और सबसे आखिर में रोटी या चावल खाएं। इससे ब्लड शुगर स्थिर रहता है और खाना खाने के बाद सुस्ती नहीं आती।`,
    image: "/images/blog/blog-4-protein-thali.jpg",
    author: "Surya Singh",
    publishedAt: "2026-09-23T11:00:00.000Z",
    readTime: "6 min read",
    order: 3,
  },
  {
    id: "traditional-herbal-kadhas-immunity",
    title: "Traditional Herbal Kadhas: Natural Elixirs for Stronger Immunity & Digestion",
    titleHi: "पारंपरिक हर्बल काढ़ा: मजबूत इम्यूनिटी और पाचन के लिए असरदार नेचुरल ड्रिंक्स",
    status: "published",
    category: "Home Remedies",
    excerpt: "Ancient botanical wisdom for seasonal resilience. Brew the perfect immunity kadha with tulsi, cinnamon, cloves, and black pepper for daily vitality.",
    body: `Before modern vitamin supplements, traditional households relied on freshly brewed botanical infusions (kadhas) to combat seasonal weather shifts, boost respiratory health, and strengthen the body's natural defenses.

The Core Ingredients & Their Science:
- Tulsi (Holy Basil): Known as the queen of herbs, rich in eugenol and adaptogenic compounds that help the body manage physical and mental stress.
- Ceylon Cinnamon (Dalchini): Contains cinnamaldehyde, which supports insulin sensitivity and exhibits strong antiviral and antibacterial properties.
- Whole Cloves (Laung): High in eugenol, cloves soothe throat irritation and improve respiratory comfort.
- Black Peppercorns (Kali Mirch): Enhance thermal heat in the digestive tract and improve the absorption of all surrounding botanicals.

The Ideal Kadha Recipe:
1. In a small stainless steel pot, bring 3 cups of fresh filtered water to a rolling boil.
2. Add 6 to 8 fresh tulsi leaves, a 1-inch crushed cinnamon stick, 3 crushed black peppercorns, 2 whole cloves, and half a teaspoon of crushed fresh ginger.
3. Simmer on medium-low heat for 8 to 10 minutes until the liquid reduces to approximately half.
4. Strain into a cup and stir in half a teaspoon of raw organic honey or jaggery (never boil honey directly).
5. Sip slowly while warm, preferably in the late morning or early evening.

Frequency & Precautions:
During weather transitions, sipping this tea 3 to 4 times a week provides exceptional protection. Avoid over-boiling or consuming in excessive quantities if you have high acidity (Pitta aggravation). Natural medicine works through gentle consistency.`,
    bodyHi: `सर्दियों और मौसम बदलने के समय हमारी रोग प्रतिरोधक क्षमता (इम्यूनिटी) को मजबूत रखने के लिए दादी-नानी के पारंपरिक काढ़े आज भी सबसे असरदार हैं।

मुख्य औषधियां और उनके लाभ:
- तुलसी: तनाव कम करने और फेफड़ों को स्वस्थ रखने के लिए सर्वोत्तम।
- दालचीनी: शरीर की सूजन कम करती है और ब्लड शुगर को नियंत्रित रखती है।
- लौंग: गले की खराश और कफ को शांत करने में मददगार।
- काली मिर्च: शरीर की गर्माहट और पाचन शक्ति को बढ़ाती है।

काढ़ा बनाने की सही विधि:
1. एक बर्तन में 3 कप पानी उबालें।
2. इसमें 6-8 तुलसी के पत्ते, 1 इंच दालचीनी, 3 काली मिर्च, 2 लौंग और कुटी हुई अदरक डालें।
3. इसे धीमी आंच पर तब तक पकाएं जब तक पानी आधा न रह जाए।
4. छानकर इसमें थोड़ा सा शहद या गुड़ मिलाएं (शहद को कभी पानी में उबालना नहीं चाहिए)।
5. इसे गुनगुना घूंट-घूंट करके पिएं।

हफ्ते में 3-4 बार इसका सेवन मौसमी बीमारियों से बचाव करता है।`,
    image: "/images/blog/blog-5-herbal-kadha.jpg",
    author: "Surya Singh",
    publishedAt: "2026-09-26T08:00:00.000Z",
    readTime: "4 min read",
    order: 4,
  },
  {
    id: "sleep-cortisol-stress-weight-management",
    title: "Why Sleep & Cortisol Matter: Managing Stress for Sustainable Weight Loss",
    titleHi: "नींद और तनाव का वजन पर असर: कॉर्टिसोल बैलेंस करके वेट लॉस कैसे करें",
    status: "published",
    category: "Mindset & Lifestyle",
    excerpt: "High stress and broken sleep elevate cortisol, leading to stubborn belly fat and sugar cravings. Discover simple evening habits to reset your nervous system.",
    body: `You can follow the cleanest diet and train with discipline every day, but if your sleep is fragmented and your stress levels remain chronically elevated, your body will fight fat loss at every step.

Understanding the Cortisol Connection
Cortisol is your primary stress hormone. In short bursts, it is vital for survival and focus. However, prolonged elevated cortisol signals your body to conserve energy and store fat, particularly around the midsection (visceral fat). Concurrently, sleep deprivation suppresses leptin (the satiety hormone) and elevates ghrelin (the hunger hormone), driving intense cravings for sugary, calorie-dense comfort foods.

Actionable Evening Habits for Deep Restorative Sleep:
1. Digital Sunset 60 Minutes Before Bed:
Blue light from smartphones and laptops inhibits melatonin secretion, delaying your circadian clock. Switch screens to night mode by 8 PM and turn off overhead white lighting in favor of warm lamps.

2. Chamomile or Nutmeg Milk:
A pinch of freshly grated nutmeg (jaiphal) in warm milk has been used for centuries as a natural sleep aid due to its gentle sedative compounds that calm an overactive central nervous system.

3. 4-7-8 Parasympathetic Breathing:
Lie flat on your back in bed. Inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, and exhale completely through your mouth for 8 seconds. Repeat 4 cycles to shift your body from fight-or-flight into rest-and-digest mode.

4. Keep Your Bedroom Cool and Dark:
Core body temperature must drop by 1 to 2 degrees Fahrenheit to initiate sound sleep. Aim for a bedroom temperature between 18°C and 21°C with blackout curtains.

Rest is not a reward for hard work—it is the prerequisite for transformation. Prioritize your sleep with the same respect you give your training and nutrition.`,
    bodyHi: `अगर आप अच्छी डाइट ले रहे हैं और कसरत भी कर रहे हैं, लेकिन फिर भी वजन कम नहीं हो रहा, तो इसका सबसे बड़ा कारण तनाव (Stress) और अधूरी नींद हो सकती है।

कॉर्टिसोल और बेली फैट का संबंध:
जब हम तनाव में होते हैं या रात को देर से सोते हैं, तो शरीर में 'कॉर्टिसोल' हार्मोन बढ़ जाता है। यह हार्मोन शरीर को फैट (विशेषकर पेट की चर्बी) स्टोर करने का संकेत देता है। साथ ही नींद की कमी से मीठा और जंक फूड खाने की तीव्र इच्छा होती है।

गहरी और सुकून भरी नींद के लिए 4 आदतें:
1. सोने से 1 घंटा पहले स्क्रीन बंद करें: मोबाइल और लैपटॉप की नीली रोशनी नींद लाने वाले मेलाटोनिन हार्मोन को रोकती है।
2. जायफल वाला गुनगुना दूध: रात को गुनगुने दूध में एक चुटकी जायफल पाउडर मिलाकर पीने से दिमाग शांत होता है और गहरी नींद आती है।
3. 4-7-8 प्राणायाम: 4 सेकंड सांस अंदर लें, 7 सेकंड रोकें, और 8 सेकंड में मुंह से बाहर छोड़ें। यह नर्वस सिस्टम को तुरंत शांत करता है।
4. कमरे को अंधेरा और ठंडा रखें: सोने के लिए शांत और कम रोशनी वाला कमरा सबसे अनुकूल होता है।

नींद को कसरत और डाइट जितनी ही प्राथमिकता दें, तभी शरीर स्वस्थ और ऊर्जावान बनेगा।`,
    image: "/images/blog/blog-6-sleep-recovery.jpg",
    author: "Surya Singh",
    publishedAt: "2026-09-29T14:30:00.000Z",
    readTime: "5 min read",
    order: 5,
  },
];

