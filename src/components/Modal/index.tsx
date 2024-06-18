import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import React, { Fragment } from "react";
import { useState } from "react";

type ModalProps = {
	title: string;
	content: string;
	isOpen: boolean;
	onClose: () => void;
    // set default button text if not set to "Schließen"
	buttonText?: string;
};

const Modal: React.FC<ModalProps> = ({ title, content, isOpen, onClose, buttonText = "Schließen" }) => {
return (
		<Transition appear show={isOpen}>
			<Dialog as="div" className="fixed inset-0 z-10 focus:outline-none" onClose={onClose}>
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-slate-400/80 backdrop-blur-lg transition-all" />
				</TransitionChild>
				<div className="flex items-center justify-center p-4 min-h-full">
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 blur-lg" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95 blur-none">
						<DialogPanel className="w-full max-w-6xl rounded-xl bg-white p-6 backdrop-blur-2xl">
							<DialogTitle as="h3" className="text-xl/10 font-sans not-italic font-semibold text-slate-950">
								{title}
							</DialogTitle>
							<p className="mt-2 text-sm/6 text-slate-500">{content}</p>
							<div className="mt-4">
								<button onClick={onClose} className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
									{buttonText}
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Modal;
