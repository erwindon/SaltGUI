/* global process */

const url = process.env.DOCKER_URL || "http://localhost:3333/";
const timeoutMs = 60_000;
const intervalMs = 1000;
const start = Date.now();

for (;;) {
  try {
    /* eslint-disable compat/compat */
    /* fetch is not supported in op_mini all */
    const res = await fetch(url);
    /* eslint-enable compat/compat */

    if (res.ok) {
      /* eslint-disable no-console */
      console.log("Docker service is up");
      /* eslint-enable no-console */
      process.exit(0);
      break;
    }
  } catch {
    // ignore connection errors
  }

  if (Date.now() - start > timeoutMs) {
    /* eslint-disable no-console */
    console.error("Timed out waiting for Docker service");
    /* eslint-enable no-console */
    process.exit(1);
    break;
  }

  /* eslint-disable compat/compat */
  /* Promise is not supported in op_mini all */
  // wait before trying again
  await new Promise(resolve => setTimeout(resolve, intervalMs));
  /* eslint-enable compat/compat */
}
