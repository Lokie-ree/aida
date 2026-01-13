import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameSessionDialog } from "@/components/shared/RenameSessionDialog";
import { DeleteSessionDialog } from "@/components/shared/DeleteSessionDialog";
import { LoadingList } from "@/components/shared/LoadingStates";
import { Id } from "../../../convex/_generated/dataModel";

interface Conversation {
  _id: Id<"promptConversations">;
  title?: string;
  lastUpdated: number;
  messages?: Array<{ role: string; content: string }>;
}

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  currentConversationId?: string;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  maxItems?: number;
}

export function ConversationList({
  conversations,
  currentConversationId,
  onRename,
  onDelete,
  maxItems = 10,
}: ConversationListProps) {
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });

  // Show loading skeleton while conversations are loading
  if (conversations === undefined) {
    return (
      <div className="px-2 py-2">
        <LoadingList count={5} />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="px-2 py-4 text-center">
        <p className="text-xs text-muted-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
      </div>
    );
  }

  const getTitle = (conv: Conversation) => {
    if (conv.title) return conv.title;
    const firstUserMessage = conv.messages?.find((m) => m.role === "user");
    if (firstUserMessage?.content) {
      return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "…" : "");
    }
    return "Untitled session";
  };

  const displayedConversations = conversations.slice(0, maxItems);

  return (
    <>
      <SidebarMenu>
        {displayedConversations.map((conv) => {
          const title = getTitle(conv);
          const isActive = currentConversationId === conv._id;
          const timeAgo = formatDistanceToNow(conv.lastUpdated, { addSuffix: true });

          return (
            <SidebarMenuItem key={conv._id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="pr-8"
                title={title}
              >
                <Link to={`/coach/${conv._id}`}>
                  <Clock className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start min-w-0 gap-0.5">
                    <span className="truncate w-full text-sm">{title}</span>
                    <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="top-1/2 -translate-y-1/2"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Session options</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setRenameDialog({ open: true, id: conv._id, title })}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteDialog({ open: true, id: conv._id, title })}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <RenameSessionDialog
        open={renameDialog.open}
        onOpenChange={(open) => setRenameDialog((prev) => ({ ...prev, open }))}
        currentTitle={renameDialog.title}
        onRename={(newTitle) => onRename(renameDialog.id, newTitle)}
      />

      <DeleteSessionDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        sessionTitle={deleteDialog.title}
        onDelete={() => onDelete(deleteDialog.id)}
      />
    </>
  );
}
