import React from 'react';
import Link from 'next/link';

interface PropLinkProps {
	href: string;
}

export const PropLink: React.FC<PropLinkProps> = ({
	href,
	children,
	...rest
}) => {
	return (
		<Link href={href}>
			<a {...rest}>{children}</a>
		</Link>
	);
};
