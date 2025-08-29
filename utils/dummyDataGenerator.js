// Enhanced dummy data generator for HumaNet prototyping
// This module provides configurable dummy data generation

const fs = require('fs');
const path = require('path');

// Base data pools for generating realistic content
const ideaTitleTemplates = [
  'AI-Powered {domain} {tool}',
  'Sustainable {domain} Platform',
  'Virtual Reality {application}',
  'Blockchain-Based {system}',
  'Smart {device} {optimization}',
  'Gamified {activity} Platform',
  'Micro-{service} {solution}',
  'Community-Driven {initiative}',
  'Voice-Controlled {environment}',
  'IoT-Enabled {monitoring} System',
  'Automated {process} {assistant}',
  'Decentralized {network} {protocol}',
  'Machine Learning {predictor}',
  'Augmented Reality {experience}',
  'Cloud-Based {infrastructure}',
];

const domainWords = [
  'Healthcare',
  'Education',
  'Finance',
  'Agriculture',
  'Transportation',
  'Energy',
  'Manufacturing',
  'Retail',
  'Entertainment',
  'Communication',
  'Security',
  'Environmental',
  'Social',
  'Urban',
  'Rural',
  'Digital',
  'Mobile',
  'Web',
  'Enterprise',
  'Consumer',
  'Research',
  'Development',
];

const techWords = [
  'Platform',
  'System',
  'Tool',
  'Assistant',
  'Optimizer',
  'Analyzer',
  'Tracker',
  'Monitor',
  'Generator',
  'Validator',
  'Scheduler',
  'Manager',
  'Controller',
  'Processor',
  'Integrator',
  'Connector',
  'Translator',
  'Simulator',
  'Predictor',
  'Classifier',
  'Detector',
  'Recommender',
];

const tagPools = {
  technology: [
    'AI',
    'Machine Learning',
    'Blockchain',
    'IoT',
    'VR',
    'AR',
    'Cloud Computing',
    'Edge Computing',
    'Quantum Computing',
  ],
  programming: [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'TypeScript',
    'Go',
    'Rust',
    'WebAssembly',
    'GraphQL',
  ],
  domains: [
    'Healthcare',
    'Education',
    'Finance',
    'Agriculture',
    'Energy',
    'Transportation',
    'Manufacturing',
    'Retail',
  ],
  concepts: [
    'Sustainability',
    'Accessibility',
    'Security',
    'Privacy',
    'Scalability',
    'Performance',
    'Innovation',
    'Automation',
  ],
  methodologies: [
    'Agile',
    'DevOps',
    'Microservices',
    'Serverless',
    'APIs',
    'Open Source',
    'Collaboration',
    'Community',
  ],
};

const userNames = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Davis',
  'David Kim',
  'Emily Chen',
  'Frank Wilson',
  'Grace Lee',
  'Henry Brown',
  'Isabella Rodriguez',
  'Jack Taylor',
  'Kate Williams',
  'Liam Anderson',
  'Maya Patel',
  'Noah Garcia',
  'Olivia Martinez',
  'Paul Thompson',
  'Quinn Robinson',
  'Rachel Clark',
  'Sam Lewis',
  'Tina Walker',
  'Uma Sharma',
  'Victor Kumar',
  'Wendy Hall',
  'Xavier Lopez',
  'Yuki Tanaka',
  'Zoe Adams',
  'Dr. Sarah Williams',
  'Prof. Michael Johnson',
  'Marcus Chen',
  'Lisa Park',
  'James Wilson',
  'Maria Gonzalez',
  'Alex Thompson',
  'Tom Anderson',
];

const statusOptions = ['open', 'in-progress', 'merged', 'closed'];

const actionTypes = ['view', 'create', 'fork', 'search', 'filter', 'update'];

class DummyDataGenerator {
  constructor(options = {}) {
    this.options = {
      seedDate: new Date('2025-01-01'),
      maxAge: 180, // days
      baseViewCount: 50,
      baseForkCount: 5,
      viewVariability: 0.5,
      forkVariability: 0.3,
      ...options,
    };
  }

  // Generate a random date within the specified range
  generateRandomDate(daysAgo = null) {
    const maxDaysAgo =
      daysAgo || Math.floor(Math.random() * this.options.maxAge);
    const date = new Date(this.options.seedDate);
    date.setDate(date.getDate() + maxDaysAgo);
    return date;
  }

  // Generate realistic view and fork counts
  generateEngagementMetrics(ageInDays) {
    const ageFactor = Math.max(0.1, 1 - ageInDays / this.options.maxAge);
    const popularityFactor = Math.random() * 2; // Some ideas are just more popular

    const baseViews = this.options.baseViewCount * ageFactor * popularityFactor;
    const viewCount = Math.floor(
      baseViews * (1 + (Math.random() - 0.5) * this.options.viewVariability)
    );

    const baseForks = this.options.baseForkCount * ageFactor * popularityFactor;
    const forkCount = Math.floor(
      baseForks * (1 + (Math.random() - 0.5) * this.options.forkVariability)
    );

    return {
      viewCount: Math.max(1, viewCount),
      forkCount: Math.max(0, forkCount),
    };
  }

  // Generate a realistic idea title
  generateIdeaTitle() {
    const template =
      ideaTitleTemplates[Math.floor(Math.random() * ideaTitleTemplates.length)];
    const domain = domainWords[Math.floor(Math.random() * domainWords.length)];
    const tech = techWords[Math.floor(Math.random() * techWords.length)];

    return template
      .replace('{domain}', domain)
      .replace('{tool}', tech)
      .replace('{application}', `${domain} ${tech}`)
      .replace('{system}', `${domain} ${tech}`)
      .replace('{device}', domain)
      .replace('{optimization}', tech)
      .replace('{activity}', domain)
      .replace('{service}', tech)
      .replace('{solution}', tech)
      .replace('{initiative}', `${domain} ${tech}`)
      .replace('{environment}', `${domain} ${tech}`)
      .replace('{monitoring}', domain)
      .replace('{process}', domain)
      .replace('{assistant}', tech)
      .replace('{network}', domain)
      .replace('{protocol}', tech)
      .replace('{predictor}', tech)
      .replace('{experience}', domain)
      .replace('{infrastructure}', tech);
  }

  // Generate a realistic description
  generateDescription(title, tags) {
    const descriptors = [
      'Develop',
      'Create',
      'Design',
      'Build',
      'Implement',
      'Engineer',
      'Architect',
      'Construct',
      'Establish',
      'Launch',
      'Deploy',
    ];

    const features = [
      'advanced analytics',
      'real-time monitoring',
      'automated workflows',
      'intelligent recommendations',
      'seamless integration',
      'scalable architecture',
      'user-friendly interface',
      'secure authentication',
      'cloud-based deployment',
      'mobile compatibility',
      'API-first design',
      'comprehensive reporting',
      'customizable dashboards',
      'machine learning capabilities',
      'predictive insights',
    ];

    const benefits = [
      'improved efficiency',
      'cost reduction',
      'enhanced user experience',
      'better decision making',
      'streamlined processes',
      'increased productivity',
      'reduced manual effort',
      'faster time to market',
      'improved accuracy',
      'better collaboration',
      'enhanced security',
      'greater scalability',
    ];

    const descriptor =
      descriptors[Math.floor(Math.random() * descriptors.length)];
    const feature1 = features[Math.floor(Math.random() * features.length)];
    const feature2 = features[Math.floor(Math.random() * features.length)];
    const benefit1 = benefits[Math.floor(Math.random() * benefits.length)];
    const benefit2 = benefits[Math.floor(Math.random() * benefits.length)];

    return `${descriptor} ${title.toLowerCase()} that incorporates ${feature1} and ${feature2}. The system would provide ${benefit1} and ${benefit2}, making it an essential tool for modern ${tags[0]?.toLowerCase() || 'technology'} applications. Features include comprehensive integration capabilities and detailed performance metrics.`;
  }

  // Generate realistic tags
  generateTags() {
    const numTags = Math.floor(Math.random() * 3) + 3; // 3-5 tags
    const selectedTags = [];

    // Pick from different categories
    const categories = Object.keys(tagPools);
    const usedCategories = [];

    while (
      selectedTags.length < numTags &&
      usedCategories.length < categories.length
    ) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      if (!usedCategories.includes(category)) {
        usedCategories.push(category);
        const categoryTags = tagPools[category];
        const tag =
          categoryTags[Math.floor(Math.random() * categoryTags.length)];
        if (!selectedTags.includes(tag)) {
          selectedTags.push(tag);
        }
      }
    }

    return selectedTags;
  }

  // Generate a single dummy idea
  generateIdea(id, options = {}) {
    const createdAt = this.generateRandomDate(options.maxAge);
    const updatedAt = new Date(
      createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const ageInDays = Math.floor(
      (new Date() - createdAt) / (1000 * 60 * 60 * 24)
    );

    const title = options.title || this.generateIdeaTitle();
    const tags = options.tags || this.generateTags();
    const description =
      options.description || this.generateDescription(title, tags);
    const createdBy =
      options.createdBy ||
      userNames[Math.floor(Math.random() * userNames.length)];
    const status =
      options.status ||
      statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const forkedFrom =
      options.forkedFrom ||
      (Math.random() < 0.2
        ? `idea-${Math.floor(Math.random() * 100) + 1}`
        : null);

    const metrics = this.generateEngagementMetrics(ageInDays);

    const lastViewedAt = new Date(
      Math.max(
        updatedAt.getTime(),
        createdAt.getTime() + Math.random() * ageInDays * 24 * 60 * 60 * 1000
      )
    );
    const lastForkedAt =
      metrics.forkCount > 0
        ? new Date(
            Math.max(
              updatedAt.getTime(),
              createdAt.getTime() +
                Math.random() * ageInDays * 24 * 60 * 60 * 1000
            )
          )
        : null;

    return {
      id,
      title,
      description,
      tags,
      status,
      createdBy,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      forkedFrom,
      viewCount: metrics.viewCount,
      forkCount: metrics.forkCount,
      lastViewedAt: lastViewedAt.toISOString(),
      lastForkedAt: lastForkedAt?.toISOString() || null,
    };
  }

  // Generate multiple dummy ideas
  generateIdeas(count = 15, options = {}) {
    const ideas = [];

    for (let i = 1; i <= count; i++) {
      const id = `idea-${String(i).padStart(3, '0')}`;
      const idea = this.generateIdea(id, options);
      ideas.push(idea);
    }

    return ideas;
  }

  // Generate dummy activity
  generateActivity(id, options = {}) {
    const action =
      options.action ||
      actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const username =
      options.username ||
      userNames[Math.floor(Math.random() * userNames.length)];
    const timestamp = options.timestamp || this.generateRandomDate(30);

    let details = {};

    switch (action) {
      case 'view':
        details = {
          ideaId: `idea-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
          ideaTitle: this.generateIdeaTitle(),
          type: 'idea',
        };
        break;

      case 'create':
        details = {
          ideaId: `idea-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
          ideaTitle: this.generateIdeaTitle(),
          type: 'idea',
        };
        break;

      case 'fork':
        details = {
          originalId: `idea-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
          newId: `idea-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
          originalTitle: this.generateIdeaTitle(),
          type: 'idea',
        };
        break;

      case 'search':
        details = {
          query: this.generateTags()[0],
          resultsCount: Math.floor(Math.random() * 20) + 1,
          type: 'search',
        };
        break;

      case 'filter':
        details = {
          filterType: ['tags', 'status', 'author'][
            Math.floor(Math.random() * 3)
          ],
          filterValue: this.generateTags()[0],
          resultsCount: Math.floor(Math.random() * 15) + 1,
          type: 'filter',
        };
        break;

      case 'update':
        details = {
          ideaId: `idea-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
          ideaTitle: this.generateIdeaTitle(),
          updateType: 'status',
          type: 'idea',
        };
        break;
    }

    return {
      id,
      username,
      action,
      details,
      timestamp: timestamp.toISOString(),
    };
  }

  // Generate multiple dummy activities
  generateActivities(count = 100, options = {}) {
    const activities = [];

    for (let i = 1; i <= count; i++) {
      const id = `activity-${Date.now()}-${i}`;
      const activity = this.generateActivity(id, options);
      activities.push(activity);
    }

    return activities;
  }

  // Generate a complete dataset
  generateDataset(options = {}) {
    const { ideasCount = 25, activitiesCount = 150, ...otherOptions } = options;

    const ideas = this.generateIdeas(ideasCount, otherOptions);
    const activities = this.generateActivities(activitiesCount, otherOptions);

    return {
      ideas,
      activities,
      users: userNames,
      meta: {
        generatedAt: new Date().toISOString(),
        ideasCount,
        activitiesCount,
        usersCount: userNames.length,
        options: this.options,
      },
    };
  }
}

// Export the class and some utilities
module.exports = {
  DummyDataGenerator,
  userNames,
  tagPools,
  statusOptions,
  actionTypes,
};
