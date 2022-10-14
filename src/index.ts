export interface Env {
  DB: KVNamespace;
  COUNTER: DurableObjectNamespace;
}

// @ts-ignore
import home from "./home.html";

function handleHome() {
  return new Response(home, {
    headers: {
      "Content-Type": "text/html;chartset=utf-8",
    },
  });
}

function handleNotFound() {
  return new Response(null, {
    status: 404,
  });
}

export class CounterObject {
  counter: number;
  constructor() {
    this.counter = 0;
  }
  async fetch(request: Request) {
    const { pathname } = new URL(request.url);
    switch (pathname) {
      case "/":
        return new Response(this.counter);
      case "/+":
        this.counter++;
        return new Response(this.counter);
      case "/-":
        this.counter--;
        return new Response(this.counter);
      default:
        return handleNotFound();
    }
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const id = env.COUNTER.idFromName("counter");
    const durableObject = env.COUNTER.get(id);
    const response = await durableObject.fetch(request);
    return response;
  },
};
