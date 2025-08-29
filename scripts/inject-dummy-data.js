const fs = require('fs');
const path = require('path');

// Dummy data for HumaNet prototyping
const dummyIdeas = [
  {
    id: 'idea-001',
    title: 'AI-Powered Code Review Assistant',
    description:
      'Develop an intelligent code review tool that uses machine learning to identify potential bugs, security vulnerabilities, and code quality issues. The system would learn from historical code reviews and provide contextual suggestions to developers, making the review process more efficient and comprehensive.',
    tags: ['AI', 'Machine Learning', 'Development Tools', 'Code Quality'],
    status: 'open',
    createdBy: 'Alice Johnson',
    createdAt: '2025-06-15T10:30:00.000Z',
    updatedAt: '2025-06-20T14:22:00.000Z',
    forkedFrom: null,
    viewCount: 147,
    forkCount: 12,
    lastViewedAt: '2025-07-04T08:15:00.000Z',
    lastForkedAt: '2025-07-02T16:45:00.000Z',
  },
  {
    id: 'idea-002',
    title: 'Sustainable Urban Farming Platform',
    description:
      'Create a digital platform that connects urban farmers, provides IoT monitoring solutions for indoor gardens, and includes a marketplace for locally grown produce. The platform would feature crop planning tools, weather integration, and community knowledge sharing to promote sustainable food production in cities.',
    tags: ['Sustainability', 'Agriculture', 'IoT', 'Community', 'Environment'],
    status: 'in-progress',
    createdBy: 'Marcus Chen',
    createdAt: '2025-06-10T14:45:00.000Z',
    updatedAt: '2025-07-01T09:30:00.000Z',
    forkedFrom: null,
    viewCount: 203,
    forkCount: 8,
    lastViewedAt: '2025-07-04T11:22:00.000Z',
    lastForkedAt: '2025-06-28T13:10:00.000Z',
  },
  {
    id: 'idea-003',
    title: 'Virtual Reality Therapy for Anxiety',
    description:
      'Design immersive VR experiences specifically for anxiety treatment and mental health support. The platform would include guided meditation environments, exposure therapy simulations, and breathing exercise games. Healthcare providers could customize treatments and track patient progress through detailed analytics.',
    tags: ['VR', 'Mental Health', 'Healthcare', 'Therapy', 'Wellness'],
    status: 'merged',
    createdBy: 'Dr. Sarah Williams',
    createdAt: '2025-05-22T11:20:00.000Z',
    updatedAt: '2025-06-25T16:45:00.000Z',
    forkedFrom: null,
    viewCount: 89,
    forkCount: 5,
    lastViewedAt: '2025-07-03T14:30:00.000Z',
    lastForkedAt: '2025-06-20T10:15:00.000Z',
  },
  {
    id: 'idea-004',
    title: 'Blockchain-Based Digital Identity System',
    description:
      'Develop a decentralized identity management system that gives users complete control over their personal data. The system would use blockchain technology to create tamper-proof digital identities, enabling secure authentication across multiple platforms while maintaining privacy and user sovereignty.',
    tags: ['Blockchain', 'Security', 'Privacy', 'Identity', 'Decentralization'],
    status: 'open',
    createdBy: 'David Kumar',
    createdAt: '2025-06-05T09:15:00.000Z',
    updatedAt: '2025-06-12T12:30:00.000Z',
    forkedFrom: null,
    viewCount: 156,
    forkCount: 15,
    lastViewedAt: '2025-07-04T09:45:00.000Z',
    lastForkedAt: '2025-07-01T15:20:00.000Z',
  },
  {
    id: 'idea-005',
    title: 'Smart Home Energy Optimization',
    description:
      'Create an intelligent energy management system for smart homes that learns usage patterns, integrates with renewable energy sources, and automatically optimizes power consumption. The system would include predictive analytics for energy costs and suggestions for reducing carbon footprint.',
    tags: ['Smart Home', 'Energy', 'IoT', 'Sustainability', 'AI'],
    status: 'open',
    createdBy: 'Emily Rodriguez',
    createdAt: '2025-06-18T16:00:00.000Z',
    updatedAt: '2025-06-25T10:15:00.000Z',
    forkedFrom: null,
    viewCount: 134,
    forkCount: 7,
    lastViewedAt: '2025-07-04T12:10:00.000Z',
    lastForkedAt: '2025-06-30T14:45:00.000Z',
  },
  {
    id: 'idea-006',
    title: 'Enhanced AI Code Review (Fork)',
    description:
      'Building upon the AI-Powered Code Review Assistant, this fork focuses specifically on JavaScript and React applications. Added features include React Hook optimization suggestions, performance bottleneck detection, and integration with popular development IDEs like VS Code.',
    tags: ['AI', 'JavaScript', 'React', 'Development Tools', 'IDE Integration'],
    status: 'in-progress',
    createdBy: 'Tom Anderson',
    createdAt: '2025-06-25T13:20:00.000Z',
    updatedAt: '2025-07-02T11:30:00.000Z',
    forkedFrom: 'idea-001',
    viewCount: 67,
    forkCount: 3,
    lastViewedAt: '2025-07-04T10:30:00.000Z',
    lastForkedAt: '2025-07-03T09:15:00.000Z',
  },
  {
    id: 'idea-007',
    title: 'Gamified Learning Platform for Programming',
    description:
      'Design an interactive platform that teaches programming concepts through game-like challenges and competitions. Features would include multiplayer coding battles, achievement systems, skill trees for different programming languages, and AI-powered personalized learning paths.',
    tags: [
      'Education',
      'Gamification',
      'Programming',
      'Learning',
      'Competition',
    ],
    status: 'open',
    createdBy: 'Lisa Park',
    createdAt: '2025-06-28T14:30:00.000Z',
    updatedAt: '2025-07-01T16:20:00.000Z',
    forkedFrom: null,
    viewCount: 98,
    forkCount: 6,
    lastViewedAt: '2025-07-04T13:45:00.000Z',
    lastForkedAt: '2025-07-02T11:30:00.000Z',
  },
  {
    id: 'idea-008',
    title: 'Micro-Learning Mobile App for Professionals',
    description:
      'Create a mobile app that delivers bite-sized learning content during commute time or breaks. The app would use spaced repetition algorithms, adaptive content delivery, and integration with professional development platforms to help busy professionals continuously improve their skills.',
    tags: [
      'Mobile',
      'Education',
      'Micro-Learning',
      'Professional Development',
      'AI',
    ],
    status: 'open',
    createdBy: 'James Wilson',
    createdAt: '2025-07-01T08:45:00.000Z',
    updatedAt: '2025-07-03T14:10:00.000Z',
    forkedFrom: null,
    viewCount: 45,
    forkCount: 2,
    lastViewedAt: '2025-07-04T15:20:00.000Z',
    lastForkedAt: '2025-07-03T17:45:00.000Z',
  },
  {
    id: 'idea-009',
    title: 'Community-Driven Climate Action Tracker',
    description:
      'Develop a platform where communities can track, share, and celebrate climate action initiatives. Features include carbon footprint calculators, local project coordination, impact visualization, and connections to environmental organizations for broader impact.',
    tags: [
      'Climate',
      'Community',
      'Environment',
      'Sustainability',
      'Social Impact',
    ],
    status: 'open',
    createdBy: 'Maria Gonzalez',
    createdAt: '2025-06-20T12:15:00.000Z',
    updatedAt: '2025-06-27T09:45:00.000Z',
    forkedFrom: null,
    viewCount: 112,
    forkCount: 9,
    lastViewedAt: '2025-07-04T14:15:00.000Z',
    lastForkedAt: '2025-07-01T12:20:00.000Z',
  },
  {
    id: 'idea-010',
    title: 'Voice-Controlled Development Environment',
    description:
      'Create a hands-free coding environment using advanced voice recognition and natural language processing. Developers could write code, navigate files, and run commands using voice commands, making programming more accessible and reducing repetitive strain injuries.',
    tags: [
      'Voice Recognition',
      'Accessibility',
      'Development Tools',
      'NLP',
      'Innovation',
    ],
    status: 'open',
    createdBy: 'Alex Thompson',
    createdAt: '2025-06-30T10:20:00.000Z',
    updatedAt: '2025-07-02T15:30:00.000Z',
    forkedFrom: null,
    viewCount: 73,
    forkCount: 4,
    lastViewedAt: '2025-07-04T16:10:00.000Z',
    lastForkedAt: '2025-07-02T18:25:00.000Z',
  },
  {
    id: 'idea-011',
    title: 'Decentralized Social Media Platform',
    description:
      'Build a blockchain-based social media platform that gives users full control over their data and content. Features include encrypted messaging, tokenized content rewards, and community-governed moderation systems.',
    tags: ['Blockchain', 'Social Media', 'Decentralization', 'Privacy', 'Web3'],
    status: 'open',
    createdBy: 'Chris Lee',
    createdAt: '2025-06-12T09:30:00.000Z',
    updatedAt: '2025-06-18T11:45:00.000Z',
    forkedFrom: null,
    viewCount: 178,
    forkCount: 11,
    lastViewedAt: '2025-07-04T17:30:00.000Z',
    lastForkedAt: '2025-07-01T14:20:00.000Z',
  },
  {
    id: 'idea-012',
    title: 'AI-Enhanced Mental Health Chatbot',
    description:
      'Develop a compassionate AI chatbot that provides 24/7 mental health support, crisis intervention, and connects users with appropriate resources. The system would use natural language processing to detect emotional states and provide personalized coping strategies.',
    tags: ['AI', 'Mental Health', 'Chatbot', 'Crisis Support', 'NLP'],
    status: 'in-progress',
    createdBy: 'Rachel Brown',
    createdAt: '2025-05-28T13:15:00.000Z',
    updatedAt: '2025-06-30T16:22:00.000Z',
    forkedFrom: null,
    viewCount: 234,
    forkCount: 18,
    lastViewedAt: '2025-07-04T18:45:00.000Z',
    lastForkedAt: '2025-07-03T12:30:00.000Z',
  },
  {
    id: 'idea-013',
    title: 'Quantum Computing Simulator for Education',
    description:
      'Create an accessible quantum computing simulator that helps students and researchers understand quantum algorithms without requiring actual quantum hardware. Include interactive visualizations and step-by-step algorithm explanations.',
    tags: [
      'Quantum Computing',
      'Education',
      'Simulation',
      'Research',
      'Visualization',
    ],
    status: 'open',
    createdBy: 'Michael Davis',
    createdAt: '2025-06-22T10:45:00.000Z',
    updatedAt: '2025-06-29T14:30:00.000Z',
    forkedFrom: null,
    viewCount: 92,
    forkCount: 5,
    lastViewedAt: '2025-07-04T19:15:00.000Z',
    lastForkedAt: '2025-07-01T16:45:00.000Z',
  },
  {
    id: 'idea-014',
    title: 'Carbon Footprint Tracking IoT System',
    description:
      'Design an IoT network that monitors and tracks carbon emissions in real-time across different activities and locations. The system would provide actionable insights for individuals and organizations to reduce their environmental impact.',
    tags: [
      'IoT',
      'Environment',
      'Carbon Tracking',
      'Sustainability',
      'Data Analytics',
    ],
    status: 'open',
    createdBy: 'Jennifer Taylor',
    createdAt: '2025-07-02T08:20:00.000Z',
    updatedAt: '2025-07-03T12:15:00.000Z',
    forkedFrom: null,
    viewCount: 38,
    forkCount: 1,
    lastViewedAt: '2025-07-04T20:00:00.000Z',
    lastForkedAt: '2025-07-03T15:30:00.000Z',
  },
  {
    id: 'idea-015',
    title: 'Augmented Reality Learning Assistant',
    description:
      'Develop an AR application that overlays educational content onto real-world objects, creating immersive learning experiences. Students could point their device at objects to learn about science, history, and other subjects through interactive 3D models and animations.',
    tags: ['AR', 'Education', 'Learning', 'Interactive', 'Mobile'],
    status: 'merged',
    createdBy: 'Robert Zhang',
    createdAt: '2025-05-15T15:30:00.000Z',
    updatedAt: '2025-06-20T09:45:00.000Z',
    forkedFrom: null,
    viewCount: 167,
    forkCount: 13,
    lastViewedAt: '2025-07-04T21:10:00.000Z',
    lastForkedAt: '2025-06-25T11:20:00.000Z',
  },
];

const dummyUsers = [
  'Alice Johnson',
  'Marcus Chen',
  'Dr. Sarah Williams',
  'David Kumar',
  'Emily Rodriguez',
  'Tom Anderson',
  'Lisa Park',
  'James Wilson',
  'Maria Gonzalez',
  'Alex Thompson',
  'Chris Lee',
  'Rachel Brown',
  'Michael Davis',
  'Jennifer Taylor',
  'Robert Zhang',
];

const generateDummyActivities = (count = 150) => {
  const actions = ['view', 'create', 'fork', 'search', 'filter', 'update'];
  const activities = [];

  for (let i = 0; i < count; i++) {
    const randomUser =
      dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomIdea =
      dummyIdeas[Math.floor(Math.random() * dummyIdeas.length)];
    const randomDate = new Date(
      Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000
    );

    let details = {};

    switch (randomAction) {
      case 'view':
        details = {
          ideaId: randomIdea.id,
          ideaTitle: randomIdea.title,
          type: 'idea',
        };
        break;
      case 'create':
        details = {
          ideaId: randomIdea.id,
          ideaTitle: randomIdea.title,
          tags: randomIdea.tags,
          type: 'idea',
        };
        break;
      case 'fork':
        details = {
          originalIdeaId: randomIdea.id,
          forkedIdeaId: `fork-${Date.now()}-${i}`,
          ideaTitle: randomIdea.title,
          type: 'idea',
        };
        break;
      case 'search':
        const searchTerms = [
          'AI',
          'blockchain',
          'sustainability',
          'education',
          'IoT',
          'health',
          'VR',
          'AR',
        ];
        details = {
          query: searchTerms[Math.floor(Math.random() * searchTerms.length)],
          resultsCount: Math.floor(Math.random() * 20) + 1,
          filters: {},
          type: 'search',
        };
        break;
      case 'filter':
        const statuses = ['open', 'in-progress', 'merged'];
        details = {
          filters: {
            status: statuses[Math.floor(Math.random() * statuses.length)],
          },
          resultsCount: Math.floor(Math.random() * 15) + 1,
          type: 'filter',
        };
        break;
      case 'update':
        details = {
          ideaId: randomIdea.id,
          ideaTitle: randomIdea.title,
          updateType: 'status',
          type: 'idea',
        };
        break;
    }

    activities.push({
      id: `activity-${Date.now()}-${i}`,
      username: randomUser,
      action: randomAction,
      details,
      timestamp: randomDate.toISOString(),
    });
  }

  return activities;
};

// Function to inject dummy data
const injectDummyData = () => {
  const projectRoot = path.join(__dirname, '..', '..');
  const ideasFilePath = path.join(projectRoot, 'ideas.json');
  const activitiesFilePath = path.join(projectRoot, 'user-activities.json');

  try {
    // Inject ideas
    console.log('🚀 Injecting dummy ideas...');
    fs.writeFileSync(ideasFilePath, JSON.stringify(dummyIdeas, null, 2));
    console.log(`✅ Successfully injected ${dummyIdeas.length} dummy ideas`);

    // Inject activities
    console.log('🚀 Injecting dummy activities...');
    const activities = generateDummyActivities(150);
    fs.writeFileSync(activitiesFilePath, JSON.stringify(activities, null, 2));
    console.log(
      `✅ Successfully injected ${activities.length} dummy activities`
    );

    console.log('\n🎉 Dummy data injection completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Ideas: ${dummyIdeas.length}`);
    console.log(`   Users: ${dummyUsers.length}`);
    console.log(`   Activities: ${activities.length}`);
    console.log(
      `   Total Views: ${dummyIdeas.reduce((sum, idea) => sum + idea.viewCount, 0)}`
    );
    console.log(
      `   Total Forks: ${dummyIdeas.reduce((sum, idea) => sum + idea.forkCount, 0)}`
    );
  } catch (error) {
    console.error('❌ Error injecting dummy data:', error);
    process.exit(1);
  }
};

// Run the injection if this script is executed directly
if (require.main === module) {
  injectDummyData();
}

module.exports = {
  dummyIdeas,
  dummyUsers,
  generateDummyActivities,
  injectDummyData,
};
