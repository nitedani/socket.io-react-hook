import { Post, PrismaClient } from "@prisma/client?server";
import { useRequestContext } from "rakkasjs";
import { useRef } from "react";
import { useSyncedState } from "socket.io-react-hook";

const prisma = import.meta.env.SSR ? new PrismaClient() : {};

export default function HomePage() {
  const ref = useRef<HTMLInputElement>(null);
  const ctx = useRequestContext();

  const postId = "test";

  const [state, setState] = useSyncedState<Post>(null, {
    serverStore: {
      set: ({ id, name }) =>
        prisma.post.upsert({
          where: {
            id: postId,
          },
          create: {
            id: postId,
            name,
          },
          update: {
            name,
          },
        }),
      get: () =>
        prisma.post.findFirst({
          where: {
            id: postId,
          },
        }),
    },
  });

  const onSetState = () => {
    setState({
      name: ref.current?.value ?? "No name",
    });
  };

  return (
    <div>
      <button onClick={onSetState}>Send state</button>
      <input type="text" ref={ref} />
      {state && (
        <div>
          <div>{state.id}</div>
          <div>{state.name}</div>
        </div>
      )}
    </div>
  );
}
