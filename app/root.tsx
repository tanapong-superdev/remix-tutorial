import {
  Outlet,
  Form,
  Link,
  NavLink,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import rootAppStyle from "./app.css";
import { createEmptyContact, getContacts } from "./data";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rootAppStyle },
];

export async function action() {
  const contact = await createEmptyContact();
  console.log("contacts", contact);
  return json({ contact });
}
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, title: "Hello World", q: q });
}

export default function App() {
  let debounceTimeout: any = null;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { contacts, title, q } = useLoaderData<typeof loader>();
  const [state, setState] = useState(q);
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    if (state !== q) {
      setSearchParams({ q: state as string });
    }
  }, [state]);
  function setValue(value: string) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setState(value);
    }, 500);
  }
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>{title}</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                defaultValue={state || ""}
                onInput={(e) => {
                  setValue(e.currentTarget.value);
                }}
                className={searching ? "loading" : ""}
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
            <Form method="post">
              <button type="submit">Newx</button>
            </Form>
          </div>
          <nav>
            <ul>
              <li>
                <Link to={`/contacts/1`}>Your Name</Link>
              </li>
              <li>
                <Link to={`/contacts/2`}>Your Friend</Link>
              </li>
            </ul>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          id="detail"
          className={navigation.state === "loading" ? "loading" : ""}
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
