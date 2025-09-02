#!/usr/bin/env tsx
/**
 * Comprehensive Database Seeding Script for Humanet
 * 
 * This script seeds the database with realistic test data covering:
 * - Multiple user types and scenarios
 * - Complex idea hierarchies and family trees
 * - Various comment patterns
 * - Edge cases and boundary conditions
 * - Performance testing data
 * 
 * Usage:
 *   npx tsx scripts/seed.ts [--clear] [--env=development|test|production] [--count=small|medium|large]
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { UserModel } from '../src/models/user.model.js';
import { IdeaModel } from '../src/models/idea.model.js';
import { CommentModel } from '../src/models/comment.model.js';
import config from '../src/config/index.js';

// Utility function to safely extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Seeding configuration
interface SeedConfig {
  clear: boolean;
  environment: 'development' | 'test' | 'production';
  dataSize: 'small' | 'medium' | 'large';
  verbose: boolean;
}

// Data size configurations
const DATA_SIZES = {
  small: {
    users: 10,
    ideas: 25,
    comments: 50,
    maxIdeaDepth: 3,
    maxCommentsPerIdea: 5
  },
  medium: {
    users: 50,
    ideas: 150,
    comments: 400,
    maxIdeaDepth: 5,
    maxCommentsPerIdea: 15
  },
  large: {
    users: 200,
    ideas: 1000,
    comments: 2500,
    maxIdeaDepth: 7,
    maxCommentsPerIdea: 25
  }
};

// Sample data templates
const SAMPLE_USERS = [
  {
    username: 'alice_innovator',
    email: 'alice@example.com',
    bio: 'Passionate about sustainable technology and green energy solutions.',
    skills: ['Renewable Energy', 'IoT', 'Sustainability', 'Product Design'],
    karma: 150
  },
  {
    username: 'bob_creator',
    email: 'bob@example.com',
    bio: 'Full-stack developer with a love for open source and community building.',
    skills: ['JavaScript', 'Node.js', 'React', 'Open Source'],
    karma: 89
  },
  {
    username: 'charlie_thinker',
    email: 'charlie@example.com',
    bio: 'Philosophy graduate turned UX designer. Believes in human-centered design.',
    skills: ['UX Design', 'Philosophy', 'Psychology', 'Prototyping'],
    karma: 201
  },
  {
    username: 'diana_researcher',
    email: 'diana@example.com',
    bio: 'AI researcher working on ethical AI and machine learning fairness.',
    skills: ['Machine Learning', 'Ethics', 'Python', 'Research'],
    karma: 45
  },
  {
    username: 'eve_entrepreneur',
    email: 'eve@example.com',
    bio: 'Serial entrepreneur focused on fintech and blockchain solutions.',
    skills: ['Blockchain', 'Fintech', 'Business Strategy', 'Venture Capital'],
    karma: 312
  },
  {
    username: 'frank_builder',
    email: 'frank@example.com',
    bio: 'Hardware engineer who loves robotics and IoT projects.',
    skills: ['Robotics', 'IoT', 'Hardware Design', 'Arduino'],
    karma: 78
  },
  {
    username: 'grace_analyst',
    email: 'grace@example.com',
    bio: 'Data scientist passionate about using data for social good.',
    skills: ['Data Science', 'Statistics', 'Social Impact', 'Visualization'],
    karma: 134
  },
  {
    username: 'henry_educator',
    email: 'henry@example.com',
    bio: 'Former teacher now building educational technology solutions.',
    skills: ['Education', 'EdTech', 'Curriculum Design', 'Learning Science'],
    karma: 167
  },
  {
    username: 'iris_designer',
    email: 'iris@example.com',
    bio: 'Creative director with expertise in brand design and user experience.',
    skills: ['Brand Design', 'UI/UX', 'Creative Direction', 'Typography'],
    karma: 92
  },
  {
    username: 'jack_optimist',
    email: 'jack@example.com',
    bio: 'Newcomer to the platform, excited to share ideas and learn.',
    skills: ['Photography', 'Travel', 'Writing'],
    karma: 5
  }
];

const SAMPLE_IDEA_TEMPLATES = [
  {
    title: 'Smart City Water Management System',
    description: 'An IoT-based system to monitor and optimize water usage across urban areas using smart sensors and AI predictions.',
    domain: ['Smart Cities', 'IoT', 'Sustainability', 'Water Management'],
    tags: ['smart-city', 'iot', 'water', 'sustainability', 'ai']
  },
  {
    title: 'AI-Powered Personal Learning Assistant',
    description: 'A personalized AI tutor that adapts to individual learning styles and provides customized educational content.',
    domain: ['Education', 'AI', 'Personalization', 'Learning'],
    tags: ['education', 'ai', 'learning', 'personalization', 'tutor']
  },
  {
    title: 'Blockchain-Based Carbon Credit Marketplace',
    description: 'A transparent platform for trading carbon credits using blockchain technology to ensure authenticity and prevent fraud.',
    domain: ['Blockchain', 'Environment', 'Climate', 'Trading'],
    tags: ['blockchain', 'carbon', 'climate', 'trading', 'environment']
  },
  {
    title: 'Mental Health Support Chatbot',
    description: 'An empathetic AI chatbot that provides 24/7 mental health support and connects users with professional resources.',
    domain: ['Mental Health', 'AI', 'Healthcare', 'Support'],
    tags: ['mental-health', 'ai', 'chatbot', 'healthcare', 'support']
  },
  {
    title: 'Community Tool Sharing Platform',
    description: 'A local platform where neighbors can share tools and equipment, reducing waste and building community connections.',
    domain: ['Community', 'Sharing Economy', 'Sustainability', 'Local'],
    tags: ['community', 'sharing', 'tools', 'local', 'sustainability']
  },
  {
    title: 'AR Shopping Experience for Local Businesses',
    description: 'Augmented reality app that lets customers visualize products in their space before buying from local stores.',
    domain: ['AR/VR', 'Retail', 'Local Business', 'Technology'],
    tags: ['ar', 'shopping', 'local-business', 'retail', 'visualization']
  },
  {
    title: 'Elderly Care Monitoring System',
    description: 'Non-intrusive monitoring system using ambient sensors to ensure elderly people living alone are safe and healthy.',
    domain: ['Healthcare', 'IoT', 'Elderly Care', 'Safety'],
    tags: ['healthcare', 'elderly', 'monitoring', 'iot', 'safety']
  },
  {
    title: 'Sustainable Fashion Recommendation Engine',
    description: 'AI system that recommends sustainable fashion choices based on personal style, budget, and environmental impact.',
    domain: ['Fashion', 'Sustainability', 'AI', 'Recommendations'],
    tags: ['fashion', 'sustainability', 'ai', 'recommendations', 'style']
  }
];

const COMMENT_TEMPLATES = [
  "This is a brilliant idea! I'd love to collaborate on the technical implementation.",
  "Have you considered the privacy implications of this approach?",
  "This reminds me of a similar project I worked on. Would you like to discuss potential synergies?",
  "Great concept! What would be the estimated development timeline?",
  "I see potential challenges with scalability. How do you plan to address them?",
  "This could really make a difference in underserved communities.",
  "What's your go-to-market strategy for this idea?",
  "I have some experience in this domain and would be happy to provide feedback.",
  "Have you looked into existing solutions in this space?",
  "The environmental impact of this idea is impressive!",
  "This could benefit from a user-centered design approach.",
  "What kind of funding would this project require?",
  "I'm working on something similar - perhaps we could join forces?",
  "This addresses a real pain point I've experienced personally.",
  "Have you considered open-sourcing parts of this project?"
];

class DatabaseSeeder {
  private config: SeedConfig;
  private createdUsers: any[] = [];
  private createdIdeas: any[] = [];
  private createdComments: any[] = [];

  constructor(config: SeedConfig) {
    this.config = config;
  }

  async connect() {
    try {
      await mongoose.connect(config.MONGO_URL);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  async clearDatabase() {
    if (this.config.clear) {
      console.log('🗑️  Clearing existing data...');
      await Promise.all([
        UserModel.deleteMany({}),
        IdeaModel.deleteMany({}),
        CommentModel.deleteMany({})
      ]);
      console.log('✅ Database cleared');
    }
  }

  async createUsers() {
    console.log('👥 Creating users...');
    const dataSize = DATA_SIZES[this.config.dataSize];
    const hashedPassword = await bcryptjs.hash('password123', 12);

    // Create base users from templates
    for (let i = 0; i < Math.min(SAMPLE_USERS.length, dataSize.users); i++) {
      const template = SAMPLE_USERS[i];
      try {
        const user = await UserModel.create({
          ...template,
          passwordHash: hashedPassword
        });
        this.createdUsers.push(user);
        if (this.config.verbose) {
          console.log(`  ✓ Created user: ${user.username}`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Failed to create user ${template.username}:`, getErrorMessage(error));
      }
    }

    // Create additional random users if needed
    const remainingUsers = dataSize.users - this.createdUsers.length;
    for (let i = 0; i < remainingUsers; i++) {
      const randomNum = Math.floor(Math.random() * 10000);
      try {
        const user = await UserModel.create({
          username: `user_${randomNum}`,
          email: `user${randomNum}@example.com`,
          passwordHash: hashedPassword,
          bio: this.generateRandomBio(),
          skills: this.generateRandomSkills(),
          karma: Math.floor(Math.random() * 500)
        });
        this.createdUsers.push(user);
        if (this.config.verbose) {
          console.log(`  ✓ Created user: ${user.username}`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Failed to create random user ${randomNum}:`, getErrorMessage(error));
      }
    }

    console.log(`✅ Created ${this.createdUsers.length} users`);
  }

  async createIdeas() {
    console.log('💡 Creating ideas...');
    const dataSize = DATA_SIZES[this.config.dataSize];

    // Create root ideas from templates
    for (let i = 0; i < Math.min(SAMPLE_IDEA_TEMPLATES.length, dataSize.ideas); i++) {
      const template = SAMPLE_IDEA_TEMPLATES[i];
      const author = this.getRandomUser();
      
      try {
        const idea = await IdeaModel.create({
          ...template,
          author: author._id,
          upvotes: this.generateRandomUpvotes(),
          upvotedBy: this.generateRandomUpvoters()
        });
        this.createdIdeas.push(idea);
        if (this.config.verbose) {
          console.log(`  ✓ Created idea: ${idea.title}`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Failed to create idea ${template.title}:`, getErrorMessage(error));
      }
    }

    // Create additional random ideas
    const remainingIdeas = dataSize.ideas - this.createdIdeas.length;
    for (let i = 0; i < remainingIdeas; i++) {
      const author = this.getRandomUser();
      try {
        const idea = await IdeaModel.create({
          title: this.generateRandomTitle(),
          description: this.generateRandomDescription(),
          domain: this.generateRandomDomains(),
          author: author._id,
          upvotes: this.generateRandomUpvotes(),
          upvotedBy: this.generateRandomUpvoters()
        });
        this.createdIdeas.push(idea);
        if (this.config.verbose) {
          console.log(`  ✓ Created idea: ${idea.title}`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Failed to create random idea:`, getErrorMessage(error));
      }
    }

    // Create idea family trees (forks)
    await this.createIdeaForks();

    console.log(`✅ Created ${this.createdIdeas.length} ideas`);
  }

  async createIdeaForks() {
    console.log('🌳 Creating idea family trees...');
    const dataSize = DATA_SIZES[this.config.dataSize];
    const forksToCreate = Math.floor(this.createdIdeas.length * 0.3); // 30% of ideas will have forks

    for (let i = 0; i < forksToCreate; i++) {
      const parentIdea = this.getRandomIdea();
      const author = this.getRandomUser();
      const depth = this.getIdeaDepth(parentIdea._id);

      if (depth < dataSize.maxIdeaDepth) {
        try {
          const fork = await IdeaModel.create({
            title: `${parentIdea.title} - Enhanced Version`,
            description: `Building upon the original idea: ${parentIdea.description}\n\nMy enhancement: ${this.generateRandomDescription()}`,
            domain: parentIdea.domain.slice(0, 3).concat(this.generateRandomDomains().slice(0, 2)).slice(0, 5), // Ensure max 5 domains
            author: author._id,
            parentId: parentIdea._id,
            upvotes: this.generateRandomUpvotes(),
            upvoters: this.generateRandomUpvoters()
          });
          
          // Update parent idea's fork count
          await IdeaModel.findByIdAndUpdate(parentIdea._id, {
            $inc: { forkCount: 1 }
          });

          this.createdIdeas.push(fork);
          if (this.config.verbose) {
            console.log(`  ✓ Created fork: ${fork.title}`);
          }
        } catch (error) {
          console.warn(`  ⚠️  Failed to create fork:`, getErrorMessage(error));
        }
      }
    }
  }

  async createComments() {
    console.log('💬 Creating comments...');
    const dataSize = DATA_SIZES[this.config.dataSize];
    let commentsCreated = 0;

    for (const idea of this.createdIdeas) {
      const numComments = Math.floor(Math.random() * dataSize.maxCommentsPerIdea) + 1;
      
      for (let i = 0; i < numComments && commentsCreated < dataSize.comments; i++) {
        const author = this.getRandomUser();
        
        try {
          const comment = await CommentModel.create({
            text: this.getRandomComment(),
            authorId: author._id,
            ideaId: idea._id
          });
          
          this.createdComments.push(comment);
          commentsCreated++;
          
          if (this.config.verbose && commentsCreated % 50 === 0) {
            console.log(`  ✓ Created ${commentsCreated} comments...`);
          }
        } catch (error) {
          console.warn(`  ⚠️  Failed to create comment:`, getErrorMessage(error));
        }
      }
    }

    // Create some nested comments (replies)
    await this.createNestedComments();

    console.log(`✅ Created ${this.createdComments.length} comments`);
  }

  async createNestedComments() {
    console.log('🔄 Creating nested comments...');
    const repliesCount = Math.floor(this.createdComments.length * 0.2); // 20% replies

    for (let i = 0; i < repliesCount; i++) {
      const parentComment = this.getRandomCreatedComment();
      const author = this.getRandomUser();
      
      try {
        const reply = await CommentModel.create({
          text: `@${parentComment.authorId} ${this.getRandomComment()}`,
          authorId: author._id,
          ideaId: parentComment.ideaId
        });
        
        this.createdComments.push(reply);
        if (this.config.verbose) {
          console.log(`  ✓ Created reply to comment`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Failed to create reply:`, getErrorMessage(error));
      }
    }
  }

  async createEdgeCaseData() {
    console.log('🎯 Creating edge case test data...');

    // User with maximum skills (20)
    try {
      const maxSkillsUser = await UserModel.create({
        username: 'max_skills_user',
        email: 'maxskills@example.com',
        passwordHash: await bcryptjs.hash('password123', 12),
        bio: 'User with maximum allowed skills for testing boundary conditions.',
        skills: [
          'JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'TypeScript', 'PHP',
          'Ruby', 'Swift', 'Kotlin', 'Scala', 'Haskell', 'Clojure', 'Erlang',
          'R', 'MATLAB', 'SQL', 'NoSQL', 'GraphQL'
        ],
        karma: 1000
      });
      this.createdUsers.push(maxSkillsUser);
      console.log('  ✓ Created user with maximum skills');
    } catch (error) {
      console.warn('  ⚠️  Failed to create max skills user:', getErrorMessage(error));
    }

    // User with minimum karma (0)
    try {
      const newUser = await UserModel.create({
        username: 'brand_new_user',
        email: 'newuser@example.com',
        passwordHash: await bcryptjs.hash('password123', 12),
        bio: 'Brand new user with zero karma for testing.',
        skills: [],
        karma: 0
      });
      this.createdUsers.push(newUser);
      console.log('  ✓ Created brand new user with zero karma');
    } catch (error) {
      console.warn('  ⚠️  Failed to create new user:', getErrorMessage(error));
    }

    // Idea with maximum length title and description
    try {
      const maxLengthIdea = await IdeaModel.create({
        title: 'A'.repeat(200), // Maximum title length
        description: 'B'.repeat(2000), // Maximum description length
        domain: ['Testing', 'Edge Cases', 'Boundary Conditions'],
        author: this.getRandomUser()._id,
        upvotes: 0,
        upvotedBy: []
      });
      this.createdIdeas.push(maxLengthIdea);
      console.log('  ✓ Created idea with maximum length content');
    } catch (error) {
      console.warn('  ⚠️  Failed to create max length idea:', getErrorMessage(error));
    }

    // Idea with minimum content
    try {
      const minLengthIdea = await IdeaModel.create({
        title: 'AI', // Minimum title length
        description: 'Smart AI system.', // Minimum description length
        domain: ['AI'],
        author: this.getRandomUser()._id,
        upvotes: 0,
        upvotedBy: []
      });
      this.createdIdeas.push(minLengthIdea);
      console.log('  ✓ Created idea with minimum length content');
    } catch (error) {
      console.warn('  ⚠️  Failed to create min length idea:', getErrorMessage(error));
    }

    // Ideas with special characters and edge cases
    const specialCases = [
      {
        title: 'Idea with "Quotes" and \'Apostrophes\'',
        description: 'Testing special characters: @#$%^&*()_+{}|:<>?[]\\;\'",./`~',
        domain: ['Testing', 'Special Characters']
      },
      {
        title: 'Idea with Numbers 123 and Symbols !@#',
        description: 'This idea contains numbers: 12345 and symbols: !@#$%^&*()',
        domain: ['Testing', 'Numbers', 'Symbols']
      },
      {
        title: 'Unicode Test: 🚀 🎯 💡 🌟',
        description: 'Testing Unicode support with emojis and special characters: 中文 العربية русский',
        domain: ['Testing', 'Unicode', 'Internationalization']
      }
    ];

    for (const testCase of specialCases) {
      try {
        const idea = await IdeaModel.create({
          ...testCase,
          author: this.getRandomUser()._id,
          upvotes: Math.floor(Math.random() * 10),
          upvotedBy: this.generateRandomUpvoters().slice(0, 3)
        });
        this.createdIdeas.push(idea);
        console.log(`  ✓ Created special case idea: ${testCase.title.substring(0, 30)}...`);
      } catch (error) {
        console.warn(`  ⚠️  Failed to create special case idea:`, getErrorMessage(error));
      }
    }

    console.log('✅ Created edge case test data');
  }

  async createPerformanceTestData() {
    if (this.config.dataSize !== 'large') {
      return;
    }

    console.log('⚡ Creating performance test data...');

    // Create a highly connected idea with many upvotes
    try {
      const popularIdea = await IdeaModel.create({
        title: 'Viral Idea - Performance Test',
        description: 'This idea is designed to test performance with many upvotes and comments.',
        domain: ['Testing', 'Performance', 'Viral'],
        author: this.getRandomUser()._id,
        upvotes: this.createdUsers.length - 1, // Almost all users upvoted
        upvotedBy: this.createdUsers.slice(1).map(user => user._id)
      });

      // Add many comments to this idea
      for (let i = 0; i < 100; i++) {
        await CommentModel.create({
          text: `Performance test comment #${i + 1}: ${this.getRandomComment()}`,
          authorId: this.getRandomUser()._id,
          ideaId: popularIdea._id
        });
      }

      this.createdIdeas.push(popularIdea);
      console.log('  ✓ Created viral idea with many interactions');
    } catch (error) {
      console.warn('  ⚠️  Failed to create performance test data:', getErrorMessage(error));
    }

    // Create deep idea family tree
    try {
      let currentParent = this.getRandomIdea();
      for (let depth = 0; depth < 6; depth++) {
        const fork = await IdeaModel.create({
          title: `Deep Fork Level ${depth + 1}`,
          description: `This is a deep fork at level ${depth + 1} for testing idea tree performance.`,
          domain: ['Testing', 'Performance', 'Deep Tree'],
          author: this.getRandomUser()._id,
          parentIdea: currentParent._id,
          upvotes: Math.floor(Math.random() * 10),
          upvotedBy: this.generateRandomUpvoters().slice(0, 5)
        });

        await IdeaModel.findByIdAndUpdate(currentParent._id, {
          $push: { children: fork._id }
        });

        currentParent = fork;
        this.createdIdeas.push(fork);
      }
      console.log('  ✓ Created deep idea family tree');
    } catch (error) {
      console.warn('  ⚠️  Failed to create deep idea tree:', getErrorMessage(error));
    }

    console.log('✅ Created performance test data');
  }

  // Helper methods
  getRandomUser() {
    return this.createdUsers[Math.floor(Math.random() * this.createdUsers.length)];
  }

  getRandomIdea() {
    return this.createdIdeas[Math.floor(Math.random() * this.createdIdeas.length)];
  }

  getRandomComment() {
    return this.getRandomCommentTemplate();
  }

  getRandomCreatedComment() {
    const comment = this.createdComments[Math.floor(Math.random() * this.createdComments.length)];
    return comment ? comment : { authorId: this.getRandomUser()._id, ideaId: this.getRandomIdea()._id };
  }

  generateRandomBio() {
    const bios = [
      'Passionate developer with a love for innovation.',
      'Designer focused on creating meaningful user experiences.',
      'Entrepreneur building the future one idea at a time.',
      'Researcher exploring the intersection of technology and society.',
      'Creative professional with expertise in digital solutions.',
      'Problem solver who believes technology can make the world better.',
      'Lifelong learner passionate about emerging technologies.',
      'Community builder connecting people through shared interests.'
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  }

  generateRandomSkills() {
    const allSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AI/ML',
      'UX Design', 'Data Science', 'Blockchain', 'DevOps', 'Cloud Computing',
      'Mobile Development', 'Project Management', 'Business Strategy',
      'Product Design', 'Marketing', 'Sales', 'Writing', 'Photography',
      'Video Production', 'Graphic Design', 'SEO', 'Social Media'
    ];
    const numSkills = Math.floor(Math.random() * 8) + 1; // 1-8 skills
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSkills);
  }

  generateRandomTitle() {
    const prefixes = ['Smart', 'AI-Powered', 'Innovative', 'Revolutionary', 'Next-Gen', 'Automated', 'Intelligent', 'Advanced'];
    const subjects = ['Platform', 'System', 'Solution', 'App', 'Tool', 'Service', 'Network', 'Framework'];
    const domains = ['Healthcare', 'Education', 'Finance', 'Environment', 'Transportation', 'Communication', 'Entertainment', 'Commerce'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return `${prefix} ${domain} ${subject}`;
  }

  generateRandomDescription() {
    const descriptions = [
      'A comprehensive solution that leverages cutting-edge technology to solve real-world problems.',
      'An innovative platform designed to improve efficiency and user experience.',
      'A revolutionary approach to traditional challenges using modern methodologies.',
      'An intelligent system that adapts to user needs and provides personalized solutions.',
      'A scalable solution built with sustainability and accessibility in mind.',
      'A user-friendly platform that bridges the gap between technology and human needs.',
      'An automated system that streamlines processes and reduces manual overhead.',
      'A data-driven approach to solving complex problems with measurable outcomes.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  generateRandomDomains() {
    const domains = [
      'Technology', 'Healthcare', 'Education', 'Environment', 'Finance',
      'Transportation', 'Communication', 'Entertainment', 'E-commerce',
      'AI/ML', 'IoT', 'Blockchain', 'Cybersecurity', 'Cloud Computing'
    ];
    const numDomains = Math.floor(Math.random() * 4) + 1; // 1-4 domains
    const shuffled = domains.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numDomains);
  }

  generateRandomUpvotes() {
    // Weighted random: most ideas have few upvotes, some have many
    const random = Math.random();
    if (random < 0.6) return Math.floor(Math.random() * 5); // 0-4 upvotes (60%)
    if (random < 0.9) return Math.floor(Math.random() * 20) + 5; // 5-24 upvotes (30%)
    return Math.floor(Math.random() * 100) + 25; // 25-124 upvotes (10%)
  }

  generateRandomUpvoters() {
    const numUpvoters = Math.floor(Math.random() * Math.min(this.createdUsers.length, 20));
    const shuffled = this.createdUsers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numUpvoters).map(user => user._id);
  }

  getIdeaDepth(ideaId: any, depth = 0): number {
    const idea = this.createdIdeas.find(i => i._id.toString() === ideaId.toString());
    if (!idea || !idea.parentIdea) return depth;
    return this.getIdeaDepth(idea.parentIdea, depth + 1);
  }

  getRandomCommentTemplate() {
    return COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)];
  }

  async generateReport() {
    console.log('\n📊 Seeding Report');
    console.log('=================');
    console.log(`Environment: ${this.config.environment}`);
    console.log(`Data Size: ${this.config.dataSize}`);
    console.log(`Users Created: ${this.createdUsers.length}`);
    console.log(`Ideas Created: ${this.createdIdeas.length}`);
    console.log(`Comments Created: ${this.createdComments.length}`);

    // Calculate statistics
    const forkedIdeas = this.createdIdeas.filter(idea => idea.parentId).length;
    const rootIdeas = this.createdIdeas.length - forkedIdeas;
    const totalUpvotes = this.createdIdeas.reduce((sum, idea) => sum + idea.upvotes, 0);
    const avgUpvotes = (totalUpvotes / this.createdIdeas.length).toFixed(2);

    console.log(`Root Ideas: ${rootIdeas}`);
    console.log(`Forked Ideas: ${forkedIdeas}`);
    console.log(`Total Upvotes: ${totalUpvotes}`);
    console.log(`Average Upvotes per Idea: ${avgUpvotes}`);

    // Top users by karma
    const topUsers = this.createdUsers
      .sort((a, b) => b.karma - a.karma)
      .slice(0, 5);
    
    console.log('\n🏆 Top Users by Karma:');
    topUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username} (${user.karma} karma)`);
    });

    // Most upvoted ideas
    const topIdeas = this.createdIdeas
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 5);

    console.log('\n💡 Most Upvoted Ideas:');
    topIdeas.forEach((idea, index) => {
      console.log(`  ${index + 1}. ${idea.title} (${idea.upvotes} upvotes)`);
    });

    console.log('\n✅ Database seeding completed successfully!');
  }

  async run() {
    try {
      await this.connect();
      await this.clearDatabase();
      await this.createUsers();
      await this.createIdeas();
      await this.createComments();
      await this.createEdgeCaseData();
      await this.createPerformanceTestData();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    }
  }
}

// Parse command line arguments
function parseArgs(): SeedConfig {
  const args = process.argv.slice(2);
  
  // Handle both formats: "small" and "--count=small"
  let dataSize = 'medium';
  const countArg = args.find(arg => arg.startsWith('--count='));
  if (countArg) {
    dataSize = countArg.split('=')[1];
  } else {
    // Check for direct size arguments
    const sizeArg = args.find(arg => ['small', 'medium', 'large', 'production'].includes(arg));
    if (sizeArg) {
      dataSize = sizeArg;
    }
  }
  
  return {
    clear: args.includes('--clear') || args.includes('clear'),
    environment: args.find(arg => arg.startsWith('--env='))?.split('=')[1] as any || 'development',
    dataSize: dataSize as any,
    verbose: args.includes('--verbose') || args.includes('-v')
  };
}

// Main execution
// Fix Windows path compatibility
const normalizedArgv = process.argv[1].replace(/\\/g, '/');
const fileUrl = `file:///${normalizedArgv}`;

if (import.meta.url === fileUrl) {
  const seedConfig = parseArgs();
  
  console.log('🌱 Humanet Database Seeder');
  console.log('===========================');
  console.log(`Environment: ${seedConfig.environment}`);
  console.log(`Data Size: ${seedConfig.dataSize}`);
  console.log(`Clear Database: ${seedConfig.clear}`);
  console.log(`Verbose: ${seedConfig.verbose}`);
  console.log();

  const seeder = new DatabaseSeeder(seedConfig);
  seeder.run().catch(console.error);
}

export default DatabaseSeeder;
