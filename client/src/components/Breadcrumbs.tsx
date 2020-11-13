import React from 'react';
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from '@chakra-ui/core';
import { FaChevronRight } from 'react-icons/fa';
import NextLink from 'next/link';
import { crumbType } from '../util/crumbType';

interface BreadcrumbsProps {
	crumbItems: crumbType[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbItems }) => {
	return (
		<Box w="100%" background="gray.100" py={1} px={4}>
			<Box maxW={1200} m="auto">
				<Breadcrumb separator={<FaChevronRight size={10} />}>
					{crumbItems.map((item) => (
						<BreadcrumbItem>
							<NextLink href={item.ref}>
								<BreadcrumbLink>{item.text}</BreadcrumbLink>
							</NextLink>
						</BreadcrumbItem>
					))}
				</Breadcrumb>
			</Box>
		</Box>
	);
};
