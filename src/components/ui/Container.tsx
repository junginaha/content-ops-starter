import classNames from 'classnames';
import type { ReactNode } from 'react';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={classNames('mx-auto w-full max-w-composer px-5', className)}>{children}</div>;
}
