const githubApiFetcher = async <T = Record<string, unknown>>(
  url: string,
  token: string,
): Promise<T> =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())

export default githubApiFetcher
