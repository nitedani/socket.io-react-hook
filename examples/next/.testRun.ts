import { page, run, test, urlBase } from "@brillout/test-e2e";
import killPort from "kill-port";
export { testRun };

function testRun({
  cmd,
  port,
}: {
  cmd: "npm run dev" | "npm run preview";
  port?: number;
}) {
  killPort(3000);
  run(cmd, { serverIsReadyMessage: "ready" });

  test("logs Hello World!", async () =>
    new Promise(async (resolve) => {
      page.on("console", (msg) => {
        if (msg.text().includes("Hello World!")) {
          resolve();
        }
      });

      await page.goto(urlBase);
    }));
}
