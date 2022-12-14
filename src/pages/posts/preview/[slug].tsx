import { GetStaticProps } from "next"
import { getPrismicClient } from "../../../services/prismic"
import * as prismicHelper from "@prismicio/helpers"
import Head from "next/head"
import styles from "../post.module.scss"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{`${post.title} | ig.news`}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          ></div>
        </article>
        <div className={styles.continueReading}>
          Wanna continue reading?
          <Link href="/">
            <a>Subscribe now 🤗</a>
          </Link>
        </div>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params
  const prismic = getPrismicClient()
  const response = await prismic.getByUID("post", String(slug), {})
  const post = {
    slug,
    title: response.data.title,
    content: response.data.content.find((content) => content.type === "paragraph")?.text ?? "",
    updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }

  return {
    props: { post },
    revalidate: 60 * 30 //30 minutes
  }
}
