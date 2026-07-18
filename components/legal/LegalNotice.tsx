import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalNoticeProps {
  type?: 'info' | 'warning' | 'success';
  title: string;
  children: React.ReactNode;
}

const variants = {
  info: {
    icon: Info,
    classes:
      'border-blue-500/30 bg-blue-500/10 text-blue-300',
  },
  warning: {
    icon: AlertTriangle,
    classes:
      'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  },
  success: {
    icon: CheckCircle2,
    classes:
      'border-green-500/30 bg-green-500/10 text-green-300',
  },
};

export default function LegalNotice({
  type = 'info',
  title,
  children,
}: LegalNoticeProps) {
  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'my-8 rounded-2xl border p-6',
        variant.classes
      )}
    >
      <div className="flex items-start gap-4">
        <Icon className="mt-1 h-6 w-6 shrink-0" />

        <div className="space-y-2">
          <h4 className="font-semibold">
            {title}
          </h4>

          <div className="leading-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}