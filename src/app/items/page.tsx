import { AddItemsForm } from "@/components/Items/AddItemsForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getApprovalStatus } from "@/server/actions/getApprovalStatus";
export default async function ItemsPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const isEmailApproved = session
    ? await getApprovalStatus(session.user.id)
    : false;
  return (
    <AddItemsForm isEmailApproved={isEmailApproved} isLoggedIn={!!session} />
  );
}
