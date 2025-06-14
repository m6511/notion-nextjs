import * as React from 'react';

export const VisuallyHidden = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ ...props }, ref) => {
	return (
		<span
			ref={ref}
			className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]"
			{...props}
		/>
	);
});

VisuallyHidden.displayName = 'VisuallyHidden';