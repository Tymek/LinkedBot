const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then(response => response.json()) as Promise<T>

export default fetcher
