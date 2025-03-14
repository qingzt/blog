export function onRequest(context) {
    const newRequest = new Request("https://www.bing.com/hp/api/model?mkt=zh-CN", {
        method: request.method,
        headers: newHeaders,
        body: body,
        redirect: 'follow'
    });
    const response = fetch(newRequest);
    return response;
}