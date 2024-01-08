import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteContact } from "~/data";

export async function action({ params }: ActionFunctionArgs) {
  invariant(params.contactId, "no params contactId");
  await deleteContact(params.contactId);
  return redirect("/");
}
