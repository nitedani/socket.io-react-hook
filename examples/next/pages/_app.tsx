import type { AppProps } from "next/app";
import { IoProvider } from "socket.io-react-hook";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IoProvider>
      <Component {...pageProps} />
    </IoProvider>
  );
}
