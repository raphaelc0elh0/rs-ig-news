import { GetStaticProps } from "next"
import Head from "next/head"
import { getPrismicClient } from "../../services/prismic"
import styles from "./styles.module.scss"
import { PrismicRichText } from "@prismicio/react"
import Link from "next/link"

interface PostsProps {
  posts: {
    slug: string
    title: string
    excerpt: string
    updatedAt: string
  }[]
}

const Posts = ({ posts }: PostsProps) => {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const response = await prismic.getAllByType("post", { fetch: ["post.title", "post.content"], pageSize: 100 })

  const posts = response.map((post) => ({
    slug: post.uid,
    title: post.data.title,
    excerpt: post.data.content.find((content) => content.type === "paragraph")?.text ?? "",
    updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }))

  return {
    props: { posts }
  }
}

export default Posts
