import { Mail } from "lucide-react";
import LogoutLink from "./LogoutLink";

const PendingApproval = () => {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Email Pending Approval</h2>
            <p className="mb-6 text-muted-foreground">
              Your email is currently pending approval. We&apos;ll notify you
              once your account has been approved.
            </p>
            <LogoutLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
