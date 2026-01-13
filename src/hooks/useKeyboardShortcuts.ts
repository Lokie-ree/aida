import { useEffect } from "react";

interface KeyboardShortcutsOptions {
  onNewChat?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * Hook for managing keyboard shortcuts throughout the application.
 * 
 * Shortcuts:
 * - Cmd/Ctrl + K: Start new chat
 * - Escape: Close modals/dialogs (if onEscape provided)
 * 
 * @param options Configuration for keyboard shortcuts
 */
export function useKeyboardShortcuts({
  onNewChat,
  onEscape,
  enabled = true,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: New chat
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onNewChat?.();
        return;
      }

      // Escape: Close modals/dialogs
      if (e.key === "Escape" && onEscape) {
        // Only trigger if no input is focused (to allow escaping from inputs)
        if (document.activeElement?.tagName !== "INPUT" && 
            document.activeElement?.tagName !== "TEXTAREA") {
          onEscape();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewChat, onEscape, enabled]);
}
