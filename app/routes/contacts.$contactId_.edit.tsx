import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "react-router-dom";
import { getContact, updateContact } from "../data";
import invariant from "tiny-invariant";

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.contactId, 'Missing "contactId" parameter');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing "contactId" parameter');
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not found", { status: 404 });
  }
  return json({ contact });
}
export default function EditContact() {
  const navigate = useNavigate();
  let { contactId } = useParams();
  const { contact } = useLoaderData<typeof loader>();
  function cancleEdit() {
    navigate(`/contacts/${contactId}`);
  }
  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => cancleEdit()} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
