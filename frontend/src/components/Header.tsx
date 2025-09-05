'use client';

import { useAuth, useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { User, Plus, LogOut } from 'lucide-react';

export default function Header() {
  const { data: user, isLoading } = useAuth();
  const logout = useLogout();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              <a href="/" className="hover:text-primary">
                Humanet
              </a>
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            <Button variant="ghost" asChild>
              <a href="/ideas">Ideas</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/docs">Docs</a>
            </Button>
            {user && (
              <Button variant="ghost" asChild>
                <a href="/ideas/new">Create Idea</a>
              </Button>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
            ) : user ? (
              // Authenticated user
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {user.username}
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium shadow-sm">
                        {user.username[0]?.toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href={`/users/${user.username}`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/ideas/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Idea
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} disabled={logout.isPending}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {logout.isPending ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Non-authenticated user
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <a href="/auth/login">Login</a>
                </Button>
                <Button asChild>
                  <a href="/auth/register">Sign Up</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
