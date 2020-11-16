import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
	useDisclosure,
} from '@chakra-ui/core';
import React from 'react';
import { BuildType } from '../../util/types';

interface InsertModalProps {
	index: number;
	handleInsert: (index: number, item: BuildType) => void;
	onOpen?: () => void;
}

export const InsertModal: React.FC<InsertModalProps> = ({
	index,
	handleInsert,
	onOpen,
}) => {
	const { onClose, isOpen } = useDisclosure();

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Insert Item</ModalHeader>
				<ModalBody textAlign="center">
					<Button
						mx={1}
						onClick={() => {
							onClose();
							handleInsert(index, {
								type: 'title',
								value: 'Sample Title',
							});
						}}
					>
						Title
					</Button>
					<Button
						mx={1}
						onClick={() => {
							onClose();
							handleInsert(index, {
								type: 'text',
								value: 'Sample text',
							});
						}}
					>
						Text
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
