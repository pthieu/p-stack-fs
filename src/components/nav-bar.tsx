import NavMenu from './nav-menu';
import { ModeToggle } from '~/components/theme-mode-toggle';
import { cn } from '~/lib/utils';

export default function NavBar() {
  return (
    <div className={cn('flex justify-between align-middle py-2 px-4 border-b')}>
      <div className="flex items-center">Logo</div>
      <div className={cn('flex items-center gap-1')}>
        <ModeToggle />
        <NavMenu />
      </div>
    </div>
  );
}
