const BACKEND_URL = "http://98.95.183.87:8000";
// const BACKEND_URL = "http://localhost:8000";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  const url = new URL(request.url);

  const targetUrl =
    `${BACKEND_URL}/${path.join("/")}` + (url.search ? url.search : "");

  const response = await fetch(targetUrl, {
    cache: "no-store",
  });

  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
