const config = {
  host:
    process.env.NEXT_PUBLIC_HOSTNAME || process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://linked-out.vercel.app',
}

export default config
