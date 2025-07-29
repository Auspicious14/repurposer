export const PLATFORMS = [
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "blog", label: "Blog" },
  { value: "email", label: "Email" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
] as const;

export const TONES = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "humorous", label: "Humorous" },
  { value: "persuasive", label: "Persuasive" },
  { value: "informative", label: "Informative" },
] as const;

export const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g;

export const VALIDATION_MESSAGES = {
  TEMPLATE_NAME_REQUIRED: "Template Name is required",
  PLATFORM_REQUIRED: "Platform is required",
  CONTENT_REQUIRED: "Template Content is required",
  TONE_REQUIRED: "Tone is required",
  PLACEHOLDERS_REQUIRED:
    "Template must contain at least one placeholder (e.g., {{title}})",
} as const;

export const EXAMPLE_TEMPLATES = [
  {
    name: "Product Launch",
    content:
      "🚀 Hey {{firstName}}!\n\nExcited to share {{productName}} with you - it's designed to help you {{benefit}}.\n\n✨ Key features:\n• {{feature1}}\n• {{feature2}}\n\nReady to get started? {{cta}} 👉 {{link}}\n\nBest regards,\n{{yourName}}",
  },
  {
    name: "Event Invitation",
    content:
      "🎉 You're invited to {{eventName}}!\n\n📅 When: {{date}} at {{time}}\n📍 Where: {{location}}\n\n{{eventDescription}}\n\n{{specialNote}}\n\nRSVP by {{deadline}}: {{rsvpLink}}\n\nHope to see you there!\n{{organizerName}}",
  },
  {
    name: "Newsletter",
    content:
      "Hi {{firstName}},\n\nWelcome to this week's {{newsletterName}}!\n\n📈 This week's highlight:\n{{mainStory}}\n\n🔥 What's trending:\n• {{trend1}}\n• {{trend2}}\n• {{trend3}}\n\n💡 Quick tip: {{tip}}\n\nThat's all for now. Questions? Just reply!\n\n{{senderName}}",
  },
  {
    name: "Thank You Message",
    content:
      "Dear {{customerName}},\n\nThank you for {{action}}! We truly appreciate your {{supportType}}.\n\n{{personalMessage}}\n\nAs a token of our appreciation, here's {{reward}}: {{rewardDetails}}\n\nWe're grateful to have you as part of our {{community}}.\n\nWarm regards,\n{{teamName}}",
  },
  {
    name: "Job Posting",
    content:
      "🚀 We're hiring a {{jobTitle}}!\n\n🏢 Company: {{companyName}}\n📍 Location: {{location}}\n💰 Salary: {{salaryRange}}\n\nWhat you'll do:\n• {{responsibility1}}\n• {{responsibility2}}\n• {{responsibility3}}\n\nWhat we're looking for:\n• {{requirement1}}\n• {{requirement2}}\n\nInterested? Apply here: {{applicationLink}}\n\n#{{hashtag}} #Hiring",
  },
  {
    name: "Social Media Post",
    content:
      "{{hook}} 🤔\n\nHere's what I learned about {{topic}}:\n\n{{insight1}} ✨\n{{insight2}} 💡\n{{insight3}} 🎯\n\n{{callToAction}}\n\nWhat's your experience with {{topic}}? Share below! 👇\n\n#{{hashtag1}} #{{hashtag2}}",
  },
];

export const TEMPLATE_PLACEHOLDER_CONTENT =
  "Write your content here... 💡 Pro tip: Use {{placeholders}} for dynamic parts! Example: Hi {{firstName}}, check out {{productName}}!";

export const DEFAULT_SAMPLES: Record<string, string> = {
  firstName: "Sarah",
  lastname: "Johnson",
  name: "John Smith",
  customerName: "Alex Chen",
  yourName: "Your Name",
  senderName: "Mike Johnson",
  organizerName: "Event Team",
  teamName: "Our Team",

  companyName: "Amazing Company",
  productName: "Super Product",
  eventName: "Annual Conference",
  jobTitle: "Senior Developer",
  newsletterName: "Weekly Insights",

  benefit: "save time and boost productivity",
  hook: "Ever wondered why some people succeed faster?",
  topic: "productivity",
  mainStory: "New AI tools are changing how we work",
  personalMessage: "Your support means the world to us",

  feature1: "Lightning-fast performance",
  feature2: "Easy to use interface",
  trend1: "AI automation tools",
  trend2: "Remote work solutions",
  trend3: "Productivity apps",
  responsibility1: "Build amazing features",
  responsibility2: "Collaborate with the team",
  requirement1: "3+ years experience",
  requirement2: "Strong problem-solving skills",

  cta: "Get started today",
  callToAction: "What do you think?",
  action: "choosing our service",

  link: "https://example.com",
  rsvpLink: "https://event.com/rsvp",
  applicationLink: "https://jobs.com/apply",

  date: "Friday, Dec 15th",
  time: "3:00 PM EST",
  deadline: "Monday",

  location: "New York City",
  community: "customer family",

  reward: "a special discount",
  rewardDetails: "20% off your next order",
  salaryRange: "$80k - $120k",
  supportType: "continued trust",

  // Social
  hashtag: "YourBrand",
  hashtag1: "Productivity",
  hashtag2: "Success",
};
