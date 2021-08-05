const template = ({
  user,
  name,
  watchers,
  stars,
  forks,
}: {
  user: string
  name: string
  watchers: number
  stars: number
  forks: number
}): string => `@${user} 🌟 starred ${name} on GitHub!
It now has: 👁️ ${watchers} watchers  ⭐ ${stars} stars  and 🖇️ ${forks} forks
https://github.com/${name}

Follow activity on https://github.com/${user}
<[ 🤖 posted with github.com/Tymek/LinkedBot ]>
`

export default template

// @Tymek 🌟 starred adr/madr on GitHub!
// It now has: 👁️ 20 watchers ⭐ 595 stars and 🖇️ 207 forks
// Repository: https://github.com/adr/madr

// Follow activity on https://github.com/Tymek.
// <[ posted with github.com/Tymek/LinkedBot ]>
