"use client";
import React, { createContext, useContext, useState } from "react";

type ModalOptions = {
  title?: string;
  body?: React.ReactNode;
  onClose?: () => void;
};

type ConfirmOptions = {
  title?: string;
  body?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

type ModalContextValue = {
  showModal: (opts: ModalOptions) => void;
  hideModal: () => void;
  showConfirm: (opts: ConfirmOptions) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ModalOptions>({});

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOpts, setConfirmOpts] = useState<ConfirmOptions>({});
  const resolverRef = React.useRef<(value: boolean) => void | null>(null);

  function showModal(options: ModalOptions) {
    setOpts(options);
    setOpen(true);
  }

  function hideModal() {
    setOpen(false);
    if (opts.onClose) opts.onClose();
  }

  function showConfirm(options: ConfirmOptions) {
    setConfirmOpts(options);
    setConfirmOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }

  function handleConfirm(result: boolean) {
    setConfirmOpen(false);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal, showConfirm }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={hideModal} />
          <div className="relative bg-white/6 p-6 rounded-xl max-w-lg w-full glass">
            <div className="flex justify-between items-start">
              <div>
                {opts.title && <h3 className="text-lg font-semibold mb-2">{opts.title}</h3>}
                <div className="text-sm text-gray-100">{opts.body}</div>
              </div>
              <button onClick={hideModal} className="ml-4 text-gray-400">✕</button>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={hideModal} className="px-4 py-2 bg-white/10 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => handleConfirm(false)} />
          <div className="relative bg-white/6 p-6 rounded-xl max-w-lg w-full glass">
            <div className="flex justify-between items-start">
              <div>
                {confirmOpts.title && <h3 className="text-lg font-semibold mb-2">{confirmOpts.title}</h3>}
                <div className="text-sm text-gray-100">{confirmOpts.body}</div>
              </div>
              <button onClick={() => handleConfirm(false)} className="ml-4 text-gray-400">✕</button>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => handleConfirm(false)} className="px-4 py-2 bg-white/10 rounded-md">{confirmOpts.cancelText || 'Cancel'}</button>
              <button onClick={() => handleConfirm(true)} className="px-4 py-2 bg-purple-600 rounded-md text-white">{confirmOpts.confirmText || 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
