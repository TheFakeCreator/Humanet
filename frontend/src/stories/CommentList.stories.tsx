import type { Meta, StoryObj } from '@storybook/react';
import { CommentList } from '../components/ui/CommentList';

const meta: Meta<typeof CommentList> = {
  title: 'Components/CommentList',
  component: CommentList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A complete comment system with threading, voting, and real-time interactions. Note: This component requires API mocking to work properly in Storybook.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    ideaId: 'story-idea-id',
  },
  decorators: [
    (Story: any) => (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Comment System Demo</h2>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ideaId: 'demo-idea-123',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default comment list. Requires backend API to be running for full functionality.',
      },
    },
  },
};

export const Documentation: Story = {
  args: {
    ideaId: 'docs-idea-456',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This component features:\n- Threaded comments with replies\n- Upvote/downvote functionality\n- Real-time comment creation\n- User authentication integration\n- Responsive design with Tailwind CSS',
      },
    },
  },
};
