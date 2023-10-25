import { SignInButton } from '@clerk/nextjs';

import { ModeToggle } from '~/components/theme-mode-toggle';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export default function NavBarLanding() {
  return (
    <div className={cn('flex justify-between align-middle py-2 px-4 border-b')}>
      <div className="flex items-center">Logo</div>
      <div className={cn('flex items-center gap-1')}>
        <Button>
          <SignInButton />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}
