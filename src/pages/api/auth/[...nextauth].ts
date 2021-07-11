import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      scope: 'r_emailaddress r_liteprofile w_member_social',
      profileUrl:
        'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))',
      profile(profile) {
        let image: string | null = null
        try {
          const { identifier } =
            profile?.profilePicture['displayImage~'].elements[0].identifiers[0]
          image = identifier || null
        } catch {} // eslint-disable-line no-empty

        return {
          id: profile.id as string,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          email: null,
          image,
        }
      },
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  database: process.env.MONGODB_URI,
  secret: process.env.SECRET,
  session: {
    jwt: false,
    maxAge: 31 * 24 * 60 * 60 * 2, // 2 months
  },
  theme: 'auto',
  debug: false,
  callbacks: {
    async session(session, token) {
      // expose user id
      return Promise.resolve({
        ...session,
        user: { ...session.user, id: token?.id || token?.sub },
      }) as any
    },
  },
})
