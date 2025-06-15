import * as React from 'react';

export const VisuallyHidden = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ ...props }, ref) => {
	return (
		<span
			ref={ref}
			className='clip-[rect(0,0,0,0)] absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap'
			{...props}
		/>
	);
});

VisuallyHidden.displayName = 'VisuallyHidden';
