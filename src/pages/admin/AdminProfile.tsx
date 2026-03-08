import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserCog, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";

export default function AdminProfile() {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user?.email) {
      toast.error("Please enter a new email address");
      return;
    }
    setUpdatingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setUpdatingEmail(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Confirmation email sent to your new address. Please verify to complete the change.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" /> Admin Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account email and password
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" /> Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current User ID</Label>
            <Input value={user?.id ?? ""} disabled className="bg-muted font-mono text-xs" />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Changing your email will require verification via the new address.
            </p>
          </div>
          <Button onClick={handleUpdateEmail} disabled={updatingEmail} className="gap-2">
            <Save className="h-4 w-4" />
            {updatingEmail ? "Updating..." : "Update Email"}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleUpdatePassword} disabled={updatingPassword} className="gap-2">
            <Save className="h-4 w-4" />
            {updatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
