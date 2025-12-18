import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { MobileMenu } from "./MobileMenu";

interface Conversation {
  _id: string;
  title?: string;
  lastUpdated: number;
  messages?: Array<{ role: string; content: string }>;
}

interface MobileHeaderProps {
  conversations: Conversation[] | undefined;
  currentConversationId?: string;
  promptCount: number;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onSignOut: () => void;
}

export function MobileHeader({
  conversations,
  currentConversationId,
  promptCount,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onSignOut,
}: MobileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
      <Link to="/coach">
        <Logo className="scale-90" />
      </Link>
      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        promptCount={promptCount}
        onNewChat={() => {
          onNewChat();
          setMenuOpen(false);
        }}
        onRenameSession={onRenameSession}
        onDeleteSession={(id) => {
          onDeleteSession(id);
          setMenuOpen(false);
        }}
        onSignOut={onSignOut}
      />
    </header>
  );
}
