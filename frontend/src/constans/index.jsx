import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
  sztanga_gradient,
} from "../assets";

export const loggedInNavigation = [
  {
    id: "0",
    title: "Messages",
    url: "/#messages",
  },
  {
    id: "1",
    title: "Shop",
    url: "/shop",
  },
  {
    id: "2",
    title: "Classes",
    url: "/#classes",
  },
  {
    id: "3",
    title: "Calendar",
    url: "/calendar",
  },
  {
    id: "4",
    title: "Articles",
    url: "/articles",
  },
  {
    id: "5",
    title: "LogOut",
    url: "/#logout",
    onlyMobile: true,
  },
  {
    id: "6",
    title: "My account",
    url: "/#myacc",
    onlyMobile: true,
  },
];

export const navigation = [
  {
    id: "0",
    title: "Benefits",
    url: "/#benefits",
  },
  {
    id: "1",
    title: "Memberships",
    url: "/#memberships",
  },
  {
    id: "2",
    title: "Classes",
    url: "/#classes",
  },
  {
    id: "3",
    title: "Calendar",
    url: "/calendar",
  },
  {
    id: "4",
    title: "Articles",
    url: "/articles",
  },
  {
    id: "5",
    title: "New account",
    url: "/signup",
    onlyMobile: true,
  },
  {
    id: "6",
    title: "Sign in",
    url: "/login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Photo generating",
  "Photo enhance",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const memberships = [
  {
    id: "0",
    title: "Basic",
    description: "Train whenever you like, with our basic membership",
    price: "100",
    features: [
      "24/7 gym access",
      "Activity analytics",
      "Care of a gym trainer",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description:
      "With premium membership, not only you're getting basic membership features, but also additional perks",
    price: "130",
    features: [
      "Basic package features",
      "Free body scan every month",
      "Discounts on personal sessions with trainers",
    ],
  },
  {
    id: "2",
    title: "Double trouble!",
    description:
      "Share one membership across two members. It's always better to train together!",
    price: "180",
    features: [
      "Basic package featrues for both members",
      "Train with your buddy!",
    ],
  },
];

export const benefits = [
  {
    id: "0",
    title: "Healthier heart",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: "./src/assets/1.jpg",
    light: true,
  },
  {
    id: "1",
    title: "More energy",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: "./src/assets/2.jpeg",
  },
  {
    id: "2",
    title: "Better brain health",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: "./src/assets/3.jpg",
  },
  {
    id: "3",
    title: "Better Cognitive function",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: "./src/assets/4.jpg",
    light: true,
  },
  {
    id: "4",
    title: "Weight management",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: "./src/assets/5.jpg",
    light: true,
  },
  {
    id: "5",
    title: "Fun!",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: "./src/assets/6.jpg",
  },
];

export const classes = [
  {
    id: "0",
    title: "Boks",
    description:
      "Wyładuj się na worku bokserskim. Naucz się wyprowadzać ciosy i trzymać gardę!",
    photoUrl: "./src/assets/books.jpg",
    backgroundPhoto: "",
    intensity: 4,
    time: "55",
  },
  {
    id: "1",
    title: "Rowery",
    description:
      "Zalicz wyścig rowerowy w takt energetyzującej muzyki. Pobudzenie gwarantowane!",
    photoUrl: "./src/assets/rowery.jpg",
    backgroundPhoto: "",
    intensity: 3,
    time: "55",
  },
  {
    id: "2",
    title: "Joga",
    description:
      "Odpocznij psychicznie podczas ćwiczeń relaksacyjnych i oddechowych.",
    photoUrl: "./src/assets/joga.jpg",
    backgroundPhoto: "",
    intensity: 2,
    time: "55",
  },
  {
    id: "3",
    title: "Zumba",
    description: "Daj się porwać do tańca gorącym, latynowskim rytmom!",
    photoUrl: "./src/assets/zumba.jpg",
    backgroundPhoto: "",
    intensity: 3,
    time: "55",
  },
  {
    id: "4",
    title: "Płaski brzuch",
    description:
      "Spalaj nadmiar tkanki tłuszczowej i wzmacniaj mięśnie brzucha.",
    photoUrl: "./src/assets/plaski_brzuch.jpg",
    backgroundPhoto: "",
    intensity: 2,
    time: "55",
  },
  {
    id: "5",
    title: "Trening funkcjonalny",
    description:
      "Rozruszaj całe ciało. Poprawiaj wydolnośc i modeluj sylwetkę.",
    photoUrl: "./src/assets/trening_funkcjonalny.jpg",
    backgroundPhoto: "",
    intensity: 4,
    time: "55",
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];
