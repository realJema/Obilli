"use client";

import { useState } from "react";
import { useI18n } from "@/lib/providers";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText
}: ConfirmationModalProps) {
  const { t } = useI18n();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="p-4">
          <p className="text-foreground">{message}</p>
        </div>
        
        <div className="p-4 border-t border-border flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent"
            onClick={onCancel}
          >
            {cancelText || t("admin.confirmAction")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => {
              onConfirm();
              onCancel(); // Close the modal after confirmation
            }}
          >
            {confirmText || t("admin.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}