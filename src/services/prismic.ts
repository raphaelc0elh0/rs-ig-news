import { createClient } from "@prismicio/client"

export const getPrismicClient = () => {
  return createClient(process.env.PRISMIC_REPOSITORY, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })
}
