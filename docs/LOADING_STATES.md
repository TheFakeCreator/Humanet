# 🔄 Loading States Implementation

This document explains the comprehensive loading system implemented in Humanet.

## 📋 Components Overview

### Core Loading Components (`src/components/ui/loading.tsx`)

- **`Spinner`** - Basic spinning loader
- **`LoadingDots`** - Three-dot bouncing animation
- **`Skeleton`** - Shimmer placeholder for content
- **`LoadingBar`** - Top progress bar for page transitions
- **`PageLoader`** - Full-screen loading overlay
- **`CardLoader`** - Skeleton for card content
- **`ListLoader`** - Skeleton for list items

### Enhanced Button Component

```tsx
<Button 
  loading={isLoading} 
  loadingText="Saving..." 
  onClick={handleSave}
>
  Save Changes
</Button>
```

### Loading Context

```tsx
const { showPageLoader, hidePageLoader, setLoading, isLoading } = useLoading();
```

## 🎯 Usage Examples

### 1. Button Loading States

```tsx
// Login button
<Button 
  loading={loginMutation.isPending}
  loadingText="Signing in..."
  type="submit"
>
  Sign In
</Button>

// Action button
<Button 
  loading={upvoteMutation.isPending}
  onClick={handleUpvote}
>
  <ArrowUp className="w-4 h-4" />
  Upvote
</Button>
```

### 2. Page Loading States

```tsx
// Ideas page with loading skeletons
if (isLoading) {
  return (
    <div className="space-y-4">
      <ListLoader count={5} />
    </div>
  );
}

// Error state
if (error) {
  return (
    <div className="text-center">
      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
      <p>Failed to load ideas. Please try again.</p>
    </div>
  );
}
```

### 3. Form Submission Loading

```tsx
const handleSubmit = async (data) => {
  try {
    await submitWithLoading('create-idea', () => 
      createIdeaMutation.mutateAsync(data)
    );
    toast({ title: "Idea created successfully!" });
  } catch (error) {
    toast({ 
      title: "Failed to create idea", 
      variant: "destructive" 
    });
  }
};

<Button 
  loading={isSubmitting('create-idea')}
  loadingText="Creating idea..."
  type="submit"
>
  Create Idea
</Button>
```

### 4. Page Transitions

```tsx
const { navigateWithLoading } = usePageTransitions();

const handleViewIdea = (ideaId: string) => {
  navigateWithLoading(`/ideas/${ideaId}`);
};
```

### 5. Global Loading Overlay

```tsx
// Show global loader
showPageLoader("Processing your request...");

// Hide after operation
setTimeout(() => {
  hidePageLoader();
}, 2000);
```

## 🔧 Implementation Details

### Authentication Flow

```tsx
export const useLogin = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/ideas');
      }, 500);
    },
  });
};
```

### Ideas Loading

```tsx
const { data: ideasData, isLoading, error } = useIdeas({ 
  sortBy, 
  domain: selectedDomain ? [selectedDomain] : undefined, 
  page, 
  limit: 10 
});

// Loading state with proper skeletons
if (isLoading) {
  return (
    <div className="flex gap-6">
      <div className="flex-1 max-w-3xl">
        <ListLoader count={5} />
      </div>
      <div className="w-80 space-y-4">
        <CardLoader />
        <CardLoader />
      </div>
    </div>
  );
}
```

### Header Loading

```tsx
{isLoading ? (
  <div className="flex items-center space-x-3">
    <Skeleton className="h-4 w-20 hidden sm:inline-block" />
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
) : user ? (
  // User menu
) : (
  // Login buttons
)}
```

## 🎨 Visual States

### 1. Button States

- **Default**: Normal button appearance
- **Loading**: Spinner + optional loading text
- **Disabled**: Reduced opacity, no interactions
- **Success**: Brief success indication (optional)

### 2. Page States

- **Loading**: Skeleton placeholders maintaining layout
- **Error**: Clear error message with retry options
- **Empty**: Helpful empty state with actions
- **Success**: Smooth content appearance

### 3. Interaction Feedback

- **Click**: Immediate loading state
- **Navigation**: Progress bar at top
- **Form Submit**: Button loading + form disable
- **Data Fetch**: Skeleton preserve layout

## 🔄 Loading Patterns

### 1. Progressive Loading

```tsx
// Show skeleton first
<div className="space-y-4">
  {isLoading ? (
    <ListLoader count={3} />
  ) : (
    ideas?.map(idea => <IdeaCard key={idea._id} idea={idea} />)
  )}
</div>
```

### 2. Optimistic Updates

```tsx
const handleUpvote = async () => {
  // Immediately update UI
  setOptimisticUpvote(true);
  
  try {
    await upvoteMutation.mutateAsync(ideaId);
  } catch (error) {
    // Rollback on error
    setOptimisticUpvote(false);
    toast({ title: "Upvote failed", variant: "destructive" });
  }
};
```

### 3. Staggered Loading

```tsx
// Load critical content first
const { data: ideas, isLoading: ideasLoading } = useIdeas();
const { data: stats, isLoading: statsLoading } = useStats();

// Show ideas immediately, stats can load later
return (
  <div>
    {ideasLoading ? <ListLoader /> : <IdeaList ideas={ideas} />}
    {statsLoading ? <CardLoader /> : <StatsCard stats={stats} />}
  </div>
);
```

## 📱 Responsive Considerations

- Loading states work across all screen sizes
- Mobile-friendly touch targets maintained
- Skeleton components preserve responsive layout
- Loading text adapts to available space

## ⚡ Performance

- Loading components are lightweight
- Animations use CSS transforms for smooth performance
- Skeleton loading prevents layout shifts
- Optimistic updates reduce perceived loading time

## 🎯 Accessibility

- Loading states announced to screen readers
- Proper ARIA labels on loading indicators
- Focus management during loading states
- Clear loading progress communication

This loading system provides a smooth, professional user experience throughout the application! 🚀