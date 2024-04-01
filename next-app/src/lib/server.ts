// XXX(Phong): for some reason, nex.tjs in a container will take on the hostname
// of the container, which is some hash, so you end up getting a req.url like
// `https://ebd9cac9cd66:80/home` which fucks up any redirects. The container
// does get a correct host in the req headers, so we can explicitly use that to
// update the req
export function convertReqUrlToReqHostUrl(baseUrl: string, headers: Headers) {
  const host = headers.get('host');
  const url = new URL(baseUrl);
  url.host = host || url.host;

  // XXX(Phong): in production, we need to remove the port, otherwise you get
  // an updated url like `https://clipshine.com:80/home`
  if (process.env.NODE_ENV === 'production') {
    url.port = '';
  }

  return url;
}
