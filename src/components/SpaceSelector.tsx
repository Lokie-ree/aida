import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mail, Users, LogOut, Bell, Sparkles } from "lucide-react";
import { SpaceTemplateSelector } from "./SpaceTemplateSelector";

interface SpaceSelectorProps {
  currentSpaceId: Id<"spaces"> | null;
  onSpaceChange: (spaceId: Id<"spaces"> | null) => void;
}

export function SpaceSelector({ currentSpaceId, onSpaceChange }: SpaceSelectorProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInvitationsModal, setShowInvitationsModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDescription, setNewSpaceDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const spaces = useQuery(api.spaces.getUserSpaces);
  const currentSpace = useQuery(api.spaces.getSpaceById, 
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );
  const pendingInvitations = useQuery(api.spaces.getPendingInvitations);
  const spaceMembers = useQuery(api.spaces.getSpaceMembers,
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );

  const createSpace = useMutation(api.spaces.createSpace);
  const inviteUser = useMutation(api.spaces.inviteUserToSpace);
  const acceptInvitation = useMutation(api.spaces.acceptInvitation);
  const declineInvitation = useMutation(api.spaces.declineInvitation);
  const leaveSpace = useMutation(api.spaces.leaveSpace);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    setIsCreating(true);
    try {
      const spaceId = await createSpace({
        name: newSpaceName.trim(),
        description: newSpaceDescription.trim() || undefined,
      });
      
      toast.success("Space created successfully!");
      setShowCreateModal(false);
      setNewSpaceName("");
      setNewSpaceDescription("");
      onSpaceChange(spaceId);
    } catch (error) {
      console.error("Error creating space:", error);
      toast.error("Failed to create space");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !currentSpaceId) return;

    setIsInviting(true);
    try {
      await inviteUser({
        spaceId: currentSpaceId,
        email: inviteEmail.trim(),
      });
      
      toast.success("Invitation sent successfully!");
      setShowInviteModal(false);
      setInviteEmail("");
    } catch (error: any) {
      console.error("Error inviting user:", error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: Id<"spaceMembers">) => {
    try {
      await acceptInvitation({ invitationId });
      toast.success("Invitation accepted!");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: Id<"spaceMembers">) => {
    try {
      await declineInvitation({ invitationId });
      toast.success("Invitation declined");
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  const handleLeaveSpace = async () => {
    if (!currentSpaceId || !currentSpace) return;
    
    if (window.confirm(`Are you sure you want to leave "${currentSpace.name}"?`)) {
      try {
        await leaveSpace({ spaceId: currentSpaceId });
        toast.success("Left space successfully");
        onSpaceChange(null);
      } catch (error: any) {
        console.error("Error leaving space:", error);
        toast.error(error.message || "Failed to leave space");
      }
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0 space-y-3">
        {/* Space Selector with Actions */}
        <div className="flex gap-2">
          <Select
            value={currentSpaceId || "personal"}
            onValueChange={(value) => onSpaceChange(value === "personal" ? null : value as Id<"spaces">)}
          >
            <SelectTrigger className="flex-1 bg-card/80 hover:border-primary transition-all focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Space</SelectItem>
              {spaces?.map((space) => (
                <SelectItem key={space._id} value={space._id}>
                  {space.name} {space.isOwner ? "👑" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Actions */}
          <div className="flex gap-1.5">
            {pendingInvitations && pendingInvitations.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInvitationsModal(true)}
                className="relative h-10 w-10 p-0"
              >
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {pendingInvitations.length}
                </Badge>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateModal(true)}
              className="h-10 w-10 p-0 bg-gradient-to-br from-primary to-accent text-primary-foreground border-0 hover:opacity-90"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="h-10 w-10 p-0 hover:bg-accent"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Space Info - Compact */}
        {currentSpace && (
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-lg border">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-xs font-medium truncate">
                {spaceMembers?.filter(m => m.invitationStatus === "accepted").length || 0} member{(spaceMembers?.filter(m => m.invitationStatus === "accepted").length || 0) !== 1 ? 's' : ''}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                • {currentSpace.isOwner ? 'Owner' : 'Member'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {currentSpace.isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteModal(true)}
                  className="h-7 w-7 p-0 hover:bg-accent text-primary"
                  title="Invite members"
                >
                  <Mail className="w-3.5 h-3.5" />
                </Button>
              )}
              {!currentSpace.isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLeaveSpace}
                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                  title="Leave space"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Template Selector Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Start with Templates</DialogTitle>
            <DialogDescription>
              Choose a pre-configured template to get started quickly
            </DialogDescription>
          </DialogHeader>
          <SpaceTemplateSelector
            onSpaceCreated={(spaceId) => {
              setShowTemplateModal(false);
              onSpaceChange(spaceId as Id<"spaces">);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Create Space Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
            <DialogDescription>
              Create a new shared workspace for your team
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSpace} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spaceName">Space Name</Label>
              <Input
                id="spaceName"
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="e.g., Grade 4 Math Department"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spaceDescription">Description (Optional)</Label>
              <Textarea
                id="spaceDescription"
                value={newSpaceDescription}
                onChange={(e) => setNewSpaceDescription(e.target.value)}
                placeholder="Brief description of this space..."
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !newSpaceName.trim()}
                className="flex-1"
              >
                {isCreating ? "Creating..." : "Create Space"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite User Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite a colleague to join this workspace
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                The user must already have an account to receive invitations.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isInviting || !inviteEmail.trim()}
                className="flex-1"
              >
                {isInviting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pending Invitations Modal */}
      <Dialog open={showInvitationsModal} onOpenChange={setShowInvitationsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pending Invitations</DialogTitle>
            <DialogDescription>
              You have pending workspace invitations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {pendingInvitations?.map((invitation) => (
              <Card key={invitation._id} className="p-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">{invitation.spaceName}</h4>
                  <p className="text-xs text-muted-foreground">Invited by {invitation.inviterName}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptInvitation(invitation._id)}
                      size="sm"
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDeclineInvitation(invitation._id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

