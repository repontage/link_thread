import crypto from "crypto";
import prisma from "@/lib/prisma";

// Cache the keypair on globalThis to persist across hot-reloads in development
declare global {
  var _federationKeyPair: { publicKey: string; privateKey: string } | undefined;
}

if (!globalThis._federationKeyPair) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  globalThis._federationKeyPair = { publicKey, privateKey };
}

export function getFederationKeys() {
  return globalThis._federationKeyPair!;
}

export async function getWebfinger(resource: string, host: string) {
  const acctMatch = resource.match(/^acct:([^@]+)@/);
  if (!acctMatch) return null;
  const username = acctMatch[1];

  // Support platform-level host actor "voidsay"
  if (username.toLowerCase() === "voidsay") {
    return {
      subject: `acct:voidsay@${host}`,
      aliases: [`https://${host}`],
      links: [
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: `https://${host}`,
        },
        {
          rel: "self",
          type: "application/activity+json",
          href: `https://${host}/api/federation/actor/voidsay`,
        },
      ],
    };
  }

  // Look up user in database
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  return {
    subject: `acct:${username}@${host}`,
    aliases: [`https://${host}/users/${user.id}`],
    links: [
      {
        rel: "http://webfinger.net/rel/profile-page",
        type: "text/html",
        href: `https://${host}/users/${user.id}`,
      },
      {
        rel: "self",
        type: "application/activity+json",
        href: `https://${host}/api/federation/actor/${username}`,
      },
    ],
  };
}

export async function getActor(username: string, host: string) {
  const { publicKey } = getFederationKeys();

  if (username.toLowerCase() === "voidsay") {
    return {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
      ],
      id: `https://${host}/api/federation/actor/voidsay`,
      type: "Application",
      preferredUsername: "voidsay",
      name: "VoidSay",
      summary: "Universal Link Commenting Platform",
      inbox: `https://${host}/api/federation/inbox`,
      outbox: `https://${host}/api/federation/actor/voidsay/outbox`,
      publicKey: {
        id: `https://${host}/api/federation/actor/voidsay#main-key`,
        owner: `https://${host}/api/federation/actor/voidsay`,
        publicKeyPem: publicKey,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  return {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/v1",
    ],
    id: `https://${host}/api/federation/actor/${username}`,
    type: "Person",
    preferredUsername: username,
    name: user.name || username,
    summary: user.bio || "",
    inbox: `https://${host}/api/federation/inbox`,
    outbox: `https://${host}/api/federation/actor/${username}/outbox`,
    icon: user.image
      ? {
          type: "Image",
          mediaType: "image/jpeg",
          url: user.image,
        }
      : undefined,
    publicKey: {
      id: `https://${host}/api/federation/actor/${username}#main-key`,
      owner: `https://${host}/api/federation/actor/${username}`,
      publicKeyPem: publicKey,
    },
  };
}

export async function getOutbox(username: string, host: string) {
  if (username.toLowerCase() === "voidsay") {
    // Return recent platform-wide comments as Outbox items
    const comments = await prisma.comment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { User: true },
    });

    const orderedItems = comments.map((comment) => {
      const actorUsername = comment.User?.username || "anonymous";
      return {
        id: `https://${host}/api/federation/activity/comment-${comment.id}`,
        type: "Create",
        actor: `https://${host}/api/federation/actor/${actorUsername}`,
        published: comment.createdAt.toISOString(),
        to: ["https://www.w3.org/ns/activitystreams#Public"],
        object: {
          id: `https://${host}/api/federation/activity/comment-${comment.id}/note`,
          type: "Note",
          published: comment.createdAt.toISOString(),
          attributedTo: `https://${host}/api/federation/actor/${actorUsername}`,
          content: `<p>${comment.content}</p>`,
          to: ["https://www.w3.org/ns/activitystreams#Public"],
        },
      };
    });

    return {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `https://${host}/api/federation/actor/voidsay/outbox`,
      type: "OrderedCollection",
      totalItems: orderedItems.length,
      orderedItems,
    };
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      Comment: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  const orderedItems = user.Comment.map((comment) => ({
    id: `https://${host}/api/federation/activity/comment-${comment.id}`,
    type: "Create",
    actor: `https://${host}/api/federation/actor/${username}`,
    published: comment.createdAt.toISOString(),
    to: ["https://www.w3.org/ns/activitystreams#Public"],
    object: {
      id: `https://${host}/api/federation/activity/comment-${comment.id}/note`,
      type: "Note",
      published: comment.createdAt.toISOString(),
      attributedTo: `https://${host}/api/federation/actor/${username}`,
      content: `<p>${comment.content}</p>`,
      to: ["https://www.w3.org/ns/activitystreams#Public"],
    },
  }));

  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `https://${host}/api/federation/actor/${username}/outbox`,
    type: "OrderedCollection",
    totalItems: orderedItems.length,
    orderedItems,
  };
}
