import React from 'react';
import {
	Stack,
	Button,
	useDisclosure,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/core';
import { FaPlusCircle } from 'react-icons/fa';
import { BuildType } from '../../util/types';
import { EditableContainer } from './EditableContainer';

interface PostEditProps {
	buildState: BuildType[];
	handleChange: (index: number, value: string) => void;
	handleDelete: (index: number) => void;
	handleFocus: (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.FocusEvent<HTMLTextAreaElement>
	) => void;
	handleInsert: (index: number, item: BuildType) => void;
	index: number;
	setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const PostEdit: React.FC<PostEditProps> = ({
	buildState,
	handleChange,
	handleDelete,
	handleFocus,
	handleInsert,
	index,
	setIndex,
}) => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	const InsertModal = () => {
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

	return (
		<Stack w={1200} m="auto" p={4} mt={9} spacing={4}>
			{buildState.map((x, i) => (
				<>
					<EditableContainer
						key={i}
						index={i}
						handleChange={handleChange}
						handleDelete={handleDelete}
						handleFocus={handleFocus}
						type={x.type}
						value={x.value}
					/>
					<Button
						px={4}
						onClick={() => {
							setIndex(i);
							onOpen();
						}}
					>
						<FaPlusCircle color="#38A169" />
					</Button>
				</>
			))}

			{buildState.length === 0 ? (
				<Button
					px={4}
					onClick={() => {
						setIndex(0);
						onOpen();
					}}
				>
					<FaPlusCircle color="#38A169" />
				</Button>
			) : null}

			{/* TODO: Find a better method of inserting w/ Menu */}
			<InsertModal />
		</Stack>
	);
};
