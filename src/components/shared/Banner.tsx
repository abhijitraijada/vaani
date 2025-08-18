import { Icon } from '../primitives/Icon';
import { Card, Flex } from '../primitives/Layout';
import { Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';

type BannerTone = 'success' | 'error' | 'info' | 'warning';

function toneClasses(tone: BannerTone) {
  switch (tone) {
    case 'success':
      return 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100';
    case 'error':
      return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-100';
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-100';
    case 'info':
      return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100';
  }
}

export function Banner({ tone = 'info', title, description, onClose, className }: { tone?: BannerTone; title: string; description?: string; onClose?: () => void; className?: string; }) {
  return (
    <Card className={[toneClasses(tone), 'px-3 py-2'].filter(Boolean).join(' ')}>
      <Flex className={['items-center gap-3', className].filter(Boolean).join(' ')}>
        {tone === 'success' ? <Icon name="check" width={18} height={18} /> : tone === 'error' ? <Icon name="x" width={18} height={18} /> : <span className="inline-block h-2 w-2 rounded-full bg-current/60" />}
        <Flex className="min-w-0 grow flex-col">
          <Text className="truncate text-sm font-medium">{title}</Text>
          {description ? <Text className="truncate text-xs opacity-80">{description}</Text> : null}
        </Flex>
        {onClose ? (
          <Button variant="icon" aria-label="Close banner" onClick={onClose}>
            <Icon name="x" width={16} height={16} />
          </Button>
        ) : null}
      </Flex>
    </Card>
  );
}


