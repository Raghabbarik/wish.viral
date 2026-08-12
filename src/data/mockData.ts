import { Category, Template, CelebrationData } from "../types";
export const CATEGORIES: Category[] = [
  {
    id: "birthday",
    name: "Birthday",
    icon: "Cake",
    emoji: "🎂",
    description:
      "Festive birthday wishes with balloons, confetti, candles & memory galleries.",
    gradient: "from-amber-500 to-rose-500",
    badgeColor: "bg-[#b0ba99] text-[#9d6638] border-[#b0ba99]",
    count: 18,
  },
  {
    id: "anniversary",
    name: "Anniversary",
    icon: "Heart",
    emoji: "❤️",
    description:
      "Romantic love letters, timeline journey, and candlelit memories.",
    gradient: "from-rose-500 to-pink-600",
    badgeColor: "bg-[#b0ba99] text-[#9d6638] border-[#b0ba99]",
    count: 14,
  },
  {
    id: "congratulations",
    name: "Congratulations",
    icon: "Sparkles",
    emoji: "🎉",
    description:
      "Celebrate major milestones, promotions, and proud achievements.",
    gradient: "from-violet-500 to-purple-600",
    badgeColor: "bg-[#b0ba99] text-[#9d6638] border-[#b0ba99]",
    count: 12,
  },
  {
    id: "valentine",
    name: "Valentine",
    icon: "Flame",
    emoji: "💕",
    description:
      "Express heartfelt love, romantic love notes, and secret surprises.",
    gradient: "from-pink-500 to-rose-600",
    badgeColor: "bg-[#b0ba99] text-[#9d6638] border-[#b0ba99]",
    count: 10,
  },
  {
    id: "graduation",
    name: "Graduation",
    icon: "GraduationCap",
    emoji: "🎓",
    description:
      "Commemorate academic success, degree honors, and new beginnings.",
    gradient: "from-blue-500 to-indigo-600",
    badgeColor: "bg-[#b0ba99] text-[#9d6638] border-[#b0ba99]",
    count: 9,
  },
  {
    id: "wedding",
    name: "Wedding",
    icon: "Gem",
    emoji: "💍",
    description:
      "Elegant invitation cards, congratulations, and matrimonial blessings.",
    gradient: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    count: 11,
  },
  {
    id: "farewell",
    name: "Farewell",
    icon: "Send",
    emoji: "👋",
    description: "Warm goodbyes, group memory cards, and heartfelt wish walls.",
    gradient: "from-sky-500 to-cyan-600",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    count: 8,
  },
  {
    id: "achievement",
    name: "Achievement",
    icon: "Trophy",
    emoji: "🏆",
    description:
      "Highlight hard work, victory moments, award recognitions and goals.",
    gradient: "from-amber-400 to-yellow-600",
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    count: 7,
  },
  {
    id: "festival",
    name: "Festival",
    icon: "Sun",
    emoji: "🎊",
    description:
      "Bright festive greetings for New Year, Diwali, Christmas, Eid & Holidays.",
    gradient: "from-orange-500 to-red-600",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    count: 15,
  },
  {
    id: "thankyou",
    name: "Thank You",
    icon: "Smile",
    emoji: "🙏",
    description:
      "Express gratitude, appreciation notes, and thoughtful gestures.",
    gradient: "from-teal-500 to-emerald-600",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    count: 9,
  },
  {
    id: "baby",
    name: "Baby Shower",
    icon: "Baby",
    emoji: "👶",
    description:
      "Welcome new tiny additions, baby shower surprises & parenting love.",
    gradient: "from-indigo-400 to-purple-400",
    badgeColor: "bg-[#b0ba99] text-[#9d6638] border-[#b0ba99]",
    count: 6,
  },
  {
    id: "more",
    name: "More Events",
    icon: "MoreHorizontal",
    emoji: "✨",
    description:
      "Custom open-ended celebrations, housewarming, retirement & perks.",
    gradient: "from-slate-600 to-slate-800",
    badgeColor: "bg-white/60/60 text-[#4e220f] border-[#b0ba99]",
    count: 12,
  },
];
export const TEMPLATES: Template[] = [
  {
    id: "tpl-bday-surprise",
    title: "Birthday Surprise Box",
    category: "birthday",
    categoryName: "Birthday",
    description:
      "Unwrap a magic virtual gift box with floating confetti, birthday cake candle blowing, and custom music.",
    isPremium: false,
    rating: 4.9,
    useCount: 14200,
    previewImage:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    themeColor: "amber",
    gradient: "from-amber-500 via-rose-500 to-purple-600",
    bgPattern: "confetti",
    musicTrack: "birthday",
    sampleRecipient: "Sophia",
    sampleSender: "Alex & Friends",
    sampleMessage:
      "Happy Birthday Sophia! May your year ahead be filled with endless joy, unforgettable laughter, and extraordinary adventures. Make a wish and blow out the candles!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Interactive Gift Box",
      "Virtual Candle Blow",
      "Background Music",
      "3 Photo Moments",
      "Confetti Animation",
    ],
  },
  {
    id: "tpl-romantic-anniversary",
    title: "Romantic Love Story",
    category: "anniversary",
    categoryName: "Anniversary",
    description:
      "A glowing candlelit romantic card with romantic piano chords, photo timeline, and floating red hearts.",
    isPremium: true,
    rating: 4.95,
    useCount: 9800,
    previewImage:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    themeColor: "rose",
    gradient: "from-rose-500 via-pink-600 to-red-700",
    bgPattern: "hearts",
    musicTrack: "romantic",
    sampleRecipient: "Liam",
    sampleSender: "Emma",
    sampleMessage:
      "Happy 5th Anniversary my love! Every single moment spent with you feels like a dream come true. Here is to a lifetime of late-night talks, cozy coffee dates, and holding hands.",
    samplePhotos: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1529634597503-139d362ae83a?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Heart Rain Animation",
      "Romantic Piano Melodies",
      "Memory Timeline",
      "Love Note Parchment",
      "Custom Photos",
    ],
  },
  {
    id: "tpl-bday-memories",
    title: "Birthday Photo Gallery Reel",
    category: "birthday",
    categoryName: "Birthday",
    description:
      "Showcase unforgettable memories in a gorgeous glassmorphism polaroid gallery with warm sparkles.",
    isPremium: false,
    rating: 4.8,
    useCount: 11500,
    previewImage:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    themeColor: "purple",
    gradient: "from-purple-600 via-indigo-600 to-pink-500",
    bgPattern: "sparkles",
    musicTrack: "upbeat",
    sampleRecipient: "Marcus",
    sampleSender: "The Squad",
    sampleMessage:
      "Happy Birthday Marcus! Look how far we have come together. From wild weekend trips to silly moments, here are a few of our favorite memories with you.",
    samplePhotos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Polaroid Stack Effect",
      "Upbeat Sound Track",
      "Custom Captions",
      "HD Fullscreen View",
      "Lightweight Share",
    ],
  },
  {
    id: "tpl-congrats-hero",
    title: "Golden Celebration Milestone",
    category: "congratulations",
    categoryName: "Congratulations",
    description:
      "High-energy celebratory design with golden fireworks, confetti bursts, and proud achievement spotlight.",
    isPremium: false,
    rating: 4.88,
    useCount: 8300,
    previewImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    themeColor: "amber",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    bgPattern: "confetti",
    musicTrack: "upbeat",
    sampleRecipient: "Dr. Chloe Vance",
    sampleSender: "Mom & Dad",
    sampleMessage:
      "Huge Congratulations on opening your new clinic! We have watched you work endlessly with unwavering dedication. You deserve all the success in the world!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Golden Confetti Cannon",
      "Victory Ribbon Badge",
      "Interactive Message Card",
      "Social Share Integration",
    ],
  },
  {
    id: "tpl-grad-dreams",
    title: "Graduation Cap & Stars",
    category: "graduation",
    categoryName: "Graduation",
    description:
      "Celebrate degrees, diplomas, and bright futures with floating diploma caps, golden stars, and parchment wishes.",
    isPremium: false,
    rating: 4.92,
    useCount: 7400,
    previewImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    themeColor: "blue",
    gradient: "from-blue-600 via-indigo-600 to-sky-500",
    bgPattern: "sparkles",
    musicTrack: "lofi",
    sampleRecipient: "Daniel Miller",
    sampleSender: "The Miller Family",
    sampleMessage:
      "Class of 2026! Congratulations Daniel on graduating with top honors! The hard work paid off, and the world is waiting for your brilliance. Dream big!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Diploma Unroll Visual",
      "Floating Cap Throw",
      "Honor Speech Card",
      "Photo Collage",
    ],
  },
  {
    id: "tpl-valentine-hearts",
    title: "Secret Valentine Letter",
    category: "valentine",
    categoryName: "Valentine",
    description:
      "An interactive sealed envelope that unfolds into a gorgeous glowing love letter with floating heart petals.",
    isPremium: true,
    rating: 4.97,
    useCount: 16500,
    previewImage:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    themeColor: "pink",
    gradient: "from-pink-500 via-rose-500 to-red-600",
    bgPattern: "hearts",
    musicTrack: "romantic",
    sampleRecipient: "Isabella",
    sampleSender: "Your Secret Admirer",
    sampleMessage:
      "To my favorite person in the entire universe. You bring sunshine to my darkest days and warmth to my soul. Will you be my Valentine forever?",
    samplePhotos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Wax Seal Envelope Opening",
      "Heart Petals Effect",
      "Romantic Piano Track",
      "Private Password Lock",
    ],
  },
  {
    id: "tpl-wedding-elegance",
    title: "Eternal Wedding Blessings",
    category: "wedding",
    categoryName: "Wedding",
    description:
      "Sophisticated botanical design with gold leaf flourishes, wedding bells, and custom couple portrait frame.",
    isPremium: true,
    rating: 4.96,
    useCount: 6200,
    previewImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    themeColor: "emerald",
    gradient: "from-emerald-600 via-teal-600 to-slate-800",
    bgPattern: "sparkles",
    musicTrack: "romantic",
    sampleRecipient: "Olivia & Noah",
    sampleSender: "Aunt Sarah & Uncle David",
    sampleMessage:
      "Wishing the gorgeous newlyweds a lifetime of unconditional love, infinite joy, and beautiful adventures together. Congratulations on your dream wedding!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Gold Leaf Border",
      "Wedding Ring Sparkles",
      "Acoustic Melody",
      "Guestbook Note Counter",
    ],
  },
  {
    id: "tpl-farewell-cheers",
    title: "Farewell Wish Wall",
    category: "farewell",
    categoryName: "Farewell",
    description:
      "A warm tribute page for colleagues or friends departing for new ventures, with a virtual signable card.",
    isPremium: false,
    rating: 4.82,
    useCount: 5100,
    previewImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    themeColor: "sky",
    gradient: "from-sky-500 via-cyan-600 to-indigo-700",
    bgPattern: "balloons",
    musicTrack: "lofi",
    sampleRecipient: "David Chen",
    sampleSender: "Design Team at Acme",
    sampleMessage:
      "We will miss your contagious enthusiasm and brilliant ideas David! Thank you for 4 amazing years of mentorship and jokes. Best of luck at your new chapter!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Group Wish Notes",
      "Team Photo Memory",
      "Custom Goodbye Banner",
      "Downloadable PDF Card",
    ],
  },
  {
    id: "tpl-festival-lights",
    title: "Festive Lights & Magic",
    category: "festival",
    categoryName: "Festival",
    description:
      "Vibrant greeting with glowing lamps, fireworks, festive music, and custom holiday blessings.",
    isPremium: false,
    rating: 4.89,
    useCount: 12100,
    previewImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    themeColor: "orange",
    gradient: "from-orange-500 via-amber-500 to-rose-600",
    bgPattern: "sparkles",
    musicTrack: "upbeat",
    sampleRecipient: "The Sharma Family",
    sampleSender: "Rohan & Family",
    sampleMessage:
      "May the warmth of lights fill your home with abundance, health, peace and endless happiness. Wishing you and your loved ones a joyful festive season!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Diya / Light Glow Effect",
      "Sparkler Animation",
      "Festive Music",
      "Custom Greeting Card",
    ],
  },
  {
    id: "tpl-thankyou-flower",
    title: "Heartfelt Gratitude Bloom",
    category: "thankyou",
    categoryName: "Thank You",
    description:
      "A serene floral animation that blooms as the recipient opens the link, revealing your heartfelt message.",
    isPremium: false,
    rating: 4.91,
    useCount: 4300,
    previewImage:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
    themeColor: "teal",
    gradient: "from-teal-500 via-emerald-500 to-cyan-600",
    bgPattern: "sparkles",
    musicTrack: "lofi",
    sampleRecipient: "Dr. Emily Watson",
    sampleSender: "Jessica & Family",
    sampleMessage:
      "Words cannot express how deeply grateful we are for your care, kindness, and patience. Thank you from the bottom of our hearts for making a difference!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Blooming Flower FX",
      "Soft Lofi Chords",
      "Custom Appreciation Card",
      "Instant WhatsApp Link",
    ],
  },
  {
    id: "tpl-baby-shower",
    title: "Welcome Tiny Miracle",
    category: "baby",
    categoryName: "Baby Shower",
    description:
      "Adorable pastel clouds, floating starlight balloons, and sweet baby shower congratulations.",
    isPremium: false,
    rating: 4.94,
    useCount: 3900,
    previewImage:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    themeColor: "indigo",
    gradient: "from-indigo-400 via-purple-400 to-pink-400",
    bgPattern: "balloons",
    musicTrack: "lofi",
    sampleRecipient: "Hannah & Luke",
    sampleSender: "Grandma & Grandpa",
    sampleMessage:
      "Welcome to the world little angel! Congratulations Hannah & Luke on your precious newborn. May your lives be blessed with giggles, baby snuggles and endless joy.",
    samplePhotos: [
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "Pastel Cloud Animation",
      "Lullaby Sound Track",
      "Baby Strikers",
      "Photo Memory Card",
    ],
  },
  {
    id: "tpl-achievement-trophy",
    title: "Top Achiever Spotlight",
    category: "achievement",
    categoryName: "Achievement",
    description:
      "Sleek executive spotlight theme with glowing laurels, rank awards, and high performance celebratory notes.",
    isPremium: true,
    rating: 4.87,
    useCount: 3200,
    previewImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    themeColor: "slate",
    gradient: "from-slate-800 via-purple-900 to-indigo-900",
    bgPattern: "sparkles",
    musicTrack: "upbeat",
    sampleRecipient: "Siddharth Patel",
    sampleSender: "Venture Capital Team",
    sampleMessage:
      "Congratulations Siddharth on hitting $1M ARR milestone! Your relentless focus and vision set a high standard. We are proud to back your journey!",
    samplePhotos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    ],
    features: [
      "3D Trophy Glow",
      "Laurel Leaf Crest",
      "Confetti Blast",
      "High Distinction Badge",
    ],
  },
];
export const MOCK_USER_CELEBRATIONS: CelebrationData[] = [
  {
    id: "wish-101",
    templateId: "tpl-bday-surprise",
    templateTitle: "Birthday Surprise Box",
    recipientName: "Rahul Verma",
    senderName: "Priya & Friends",
    date: "2026-08-15",
    message:
      "Happy Birthday Rahul! Wishing you an incredible year ahead filled with joy, successes, and unforgettable adventures!",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    ],
    musicTrack: "birthday",
    themeColor: "amber",
    animationStyle: "confetti",
    createdAt: "2026-08-01",
    viewsCount: 42,
    slug: "rahul-birthday-2026",
    status: "Active",
  },
  {
    id: "wish-102",
    templateId: "tpl-romantic-anniversary",
    templateTitle: "Romantic Love Story",
    recipientName: "Aanya",
    senderName: "Karan",
    date: "2026-08-20",
    message:
      "To my forever partner Aanya: Every day with you is my favorite day. Happy 3rd Anniversary!",
    photos: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
    ],
    musicTrack: "romantic",
    themeColor: "rose",
    animationStyle: "hearts",
    createdAt: "2026-08-05",
    viewsCount: 18,
    slug: "aanya-karan-anniversary",
    status: "Scheduled",
  },
  {
    id: "wish-103",
    templateId: "tpl-congrats-hero",
    templateTitle: "Golden Celebration Milestone",
    recipientName: "Dr. Arjun Mehta",
    senderName: "Medical School Cohort",
    date: "2026-07-28",
    message:
      "Congratulations Dr. Arjun on passing your surgical residency exams! You did it brother!",
    photos: [
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    ],
    musicTrack: "upbeat",
    themeColor: "amber",
    animationStyle: "confetti",
    createdAt: "2026-07-28",
    viewsCount: 89,
    slug: "arjun-residency-congrats",
    status: "Delivered",
  },
];
export const MUSIC_TRACKS = [
  { id: "birthday", name: "Happy Birthday Chimes 🎂", icon: "Music" },
  { id: "romantic", name: "Romantic Piano Chords 🎹", icon: "Heart" },
  { id: "upbeat", name: "Celebration Pop Beat 🎷", icon: "Sparkles" },
  { id: "lofi", name: "Glow Ambient Lofi 🌙", icon: "Moon" },
  { id: "silent", name: "Silent / Mute Audio 🔇", icon: "VolumeX" },
];
export const PRICING_PLANS = [
  {
    id: "free",
    name: "Starter",
    badge: "Popular",
    price: "$0",
    period: "forever free",
    description:
      "Perfect for creating quick, gorgeous celebration wishes for friends and family.",
    features: [
      "Access to 20+ Free Ready-Made Templates",
      "Personalized message & up to 3 memory photos",
      "Instant shareable web link",
      "Interactive Confetti & Candle Blow animations",
      "Basic background sound tracks",
      "QR Code link generator",
      "Mobile responsive view",
    ],
    ctaText: "Get Started Free",
    isPopular: false,
    gradient: "from-slate-100 to-slate-200 text-[#4e220f]",
  },
  {
    id: "pro",
    name: "Wishora Pro",
    badge: "Recommended",
    price: "$4.99",
    period: "per month or $2.99 single pass",
    description:
      "For memorable events, weddings, milestone birthdays, and custom branded pages.",
    features: [
      "Everything in Starter",
      "Unlock ALL Premium Templates",
      "Unlimited HD photo memories gallery",
      "Custom MP3 audio music upload",
      "Password protected private link",
      "Remove Wishora watermarks",
      "Custom slug links (e.g., wishora.com/w/alex-30th)",
      "Advanced celebration animations & heart rain",
      "Priority 24/7 delivery support",
    ],
    ctaText: "Start Pro Free Trial",
    isPopular: true,
    gradient: "from-amber-500 via-rose-500 to-purple-600 text-white",
  },
  {
    id: "event",
    name: "Event Pass",
    badge: "For Weddings & Corporate",
    price: "$19.99",
    period: "one-time per event",
    description:
      "Designed for wedding guestbooks, corporate farewells, and large group wish walls.",
    features: [
      "Everything in Pro",
      "Unlimited group contributors (Guestbook Wall)",
      "Custom domain support",
      "High-res printable poster PDF export",
      "Live projector display view for parties",
      "Analytics & view notifications",
      "Dedicated event concierge",
    ],
    ctaText: "Create Event Pass",
    isPopular: false,
    gradient: "from-slate-900 to-indigo-950 text-white",
  },
];
export const TESTIMONIALS = [
  {
    quote:
      "My sister literally cried when she opened her birthday link! The surprise gift box animation and background music made it feel like a million-dollar custom website.",
    author: "Samantha Reed",
    role: "Graphic Designer, SF",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    occasion: "30th Birthday Surprise",
  },
  {
    quote:
      "We used Wishora for our 5th wedding anniversary since I was traveling for work. My husband opened it at midnight and said it was the best gift ever!",
    author: "Elena Rostova",
    role: "Architect",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    occasion: "5th Anniversary",
  },
  {
    quote:
      "Our entire engineering department collected 15 photos and farewell notes for our lead lead developer. The Wishora link was shared via Slack and everyone loved it.",
    author: "Devon Taylor",
    role: "Tech Lead",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    occasion: "Team Farewell",
  },
];
export const FAQS = [
  {
    question:
      "Do recipients need an account or app to open the celebration link?",
    answer:
      "No! Anyone can open a Wishora celebration link instantly in their mobile browser, laptop, or tablet. No app installation or sign-up is required for the recipient.",
  },
  {
    question: "How long does my generated celebration page stay active?",
    answer:
      "All free and premium celebration pages stay active online indefinitely! You can view, share, or revisit them anytime to cherish past memories.",
  },
  {
    question: "Can I edit the details or photos after I share the link?",
    answer:
      "Yes, absolutely! From your 'My Celebrations' dashboard, you can update messages, add/remove photos, or change background music anytime. The link updates automatically.",
  },
  {
    question: "How do I share the celebration via WhatsApp or social media?",
    answer:
      "Once generated, you get a 1-click 'Share on WhatsApp' button with a customized message, as well as a copyable short link, email link, and downloadable QR code!",
  },
  {
    question: "Can I add password protection to private love letters?",
    answer:
      "Yes! Pro templates allow setting a simple secret passcode so only your special someone can unlock and view the celebration.",
  },
];
