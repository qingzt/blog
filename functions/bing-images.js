export function onRequest(context) {
    const targetUrl = 'https://www.bing.com/hp/api/model?mkt=zh-CN';
    
    const request = context.request;

    // Construct new URL
    const url = new URL(request.url);
    const newUrl = targetUrl + url.pathname + url.search;

    // Clone headers
    const newHeaders = new Headers(request.headers);

    // Clone request body if it's not a GET or HEAD request
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        body = request.clone().blob();
    }

    // Create new request
    const newRequest = new Request(newUrl, {
        method: request.method,
        headers: newHeaders,
        body: body,
        redirect: 'follow'
    });

    // Send request to target server
    const response = fetch(newRequest);

    // Return response
    return response;
}