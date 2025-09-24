import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface SpaceSelectorProps {
  currentSpaceId: Id<"spaces"> | null;
  onSpaceChange: (spaceId: Id<"spaces"> | null) => void;
}

export function SpaceSelector({ currentSpaceId, onSpaceChange }: SpaceSelectorProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
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
    <div className="bg-white rounded-lg shadow-xs border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Workspace</h3>
        <div className="flex items-center gap-2">
          {pendingInvitations && pendingInvitations.length > 0 && (
            <button
              onClick={() => setShowInvitationsModal(true)}
              className="relative p-1 text-blue-600 hover:text-blue-700 transition-colors"
              title="Pending invitations"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {pendingInvitations.length}
              </span>
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
            title="Create new space"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Space Selector */}
      <select
        value={currentSpaceId || "personal"}
        onChange={(e) => onSpaceChange(e.target.value === "personal" ? null : e.target.value as Id<"spaces">)}
        className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-hidden transition-all"
      >
        <option value="personal">Personal Space</option>
        {spaces?.map((space) => (
          <option key={space._id} value={space._id}>
            {space.name} {space.isOwner ? "(Owner)" : "(Member)"}
          </option>
        ))}
      </select>

      {/* Current Space Info */}
      {currentSpace && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">{currentSpace.name}</h4>
              <p className="text-xs text-blue-700">Owner: {currentSpace.ownerName}</p>
              {spaceMembers && (
                <p className="text-xs text-blue-600 mt-1">
                  {spaceMembers.filter(m => m.invitationStatus === "accepted").length} members
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {currentSpace.isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Invite members"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </button>
              )}
              {!currentSpace.isOwner && (
                <button
                  onClick={handleLeaveSpace}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  title="Leave space"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Space</h3>
            <form onSubmit={handleCreateSpace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Name
                </label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g., Grade 4 Math Department"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-hidden transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                  placeholder="Brief description of this space..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-hidden transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newSpaceName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? "Creating..." : "Create Space"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && currentSpaceId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Member</h3>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-hidden transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The user must already have an account to receive invitations.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting || !inviteEmail.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isInviting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending Invitations Modal */}
      {showInvitationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {pendingInvitations?.map((invitation) => (
                <div key={invitation._id} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">{invitation.spaceName}</h4>
                  <p className="text-xs text-gray-600">Invited by {invitation.inviterName}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAcceptInvitation(invitation._id)}
                      className="flex-1 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineInvitation(invitation._id)}
                      className="flex-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowInvitationsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
