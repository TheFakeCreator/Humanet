import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/button';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageCircleIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
} from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button (Humanet)',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The main Button component used throughout Humanet. Built on top of shadcn/ui with custom variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Submit Idea',
  },
};

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Create Account',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Idea',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'View Profile',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Edit',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Learn More',
  },
};

// Size variations
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Get Started',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Save Draft',
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    children: <HeartIcon className="h-4 w-4" />,
  },
};

// Interactive examples with icons
export const UpvoteButton: Story = {
  args: {
    variant: 'ghost',
    size: 'sm',
    children: (
      <>
        <ThumbsUpIcon className="h-4 w-4 mr-1" />
        Upvote (42)
      </>
    ),
  },
};

export const CommentButton: Story = {
  args: {
    variant: 'ghost',
    size: 'sm',
    children: (
      <>
        <MessageCircleIcon className="h-4 w-4 mr-1" />
        Comment
      </>
    ),
  },
};

export const ShareButton: Story = {
  args: {
    variant: 'outline',
    size: 'sm',
    children: (
      <>
        <ShareIcon className="h-4 w-4 mr-1" />
        Share
      </>
    ),
  },
};

export const BookmarkButton: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
    children: <BookmarkIcon className="h-4 w-4" />,
  },
};

// States
export const Loading: Story = {
  args: {
    disabled: true,
    children: 'Creating...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable',
  },
};

// Real-world examples
export const IdeaActions: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Button variant="default">Submit Idea</Button>
      <Button variant="outline">Save Draft</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of buttons used in the idea submission form.',
      },
    },
  },
};

export const VotingControls: Story = {
  render: () => (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="sm">
        <ThumbsUpIcon className="h-4 w-4 mr-1" />
        Upvote (156)
      </Button>
      <Button variant="ghost" size="sm">
        <ThumbsDownIcon className="h-4 w-4 mr-1" />
        Downvote (3)
      </Button>
      <Button variant="ghost" size="sm">
        <MessageCircleIcon className="h-4 w-4 mr-1" />
        Comment (24)
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive voting and comment controls used on idea cards.',
      },
    },
  },
};
