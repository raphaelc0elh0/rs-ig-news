import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getStaticProps } from '../../pages/posts'
import Posts from '../../pages/posts'
import { getPrismicClient } from "../../services/prismic"

jest.mock('../../services/prismic')

const posts = [
  { slug: 'my-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: '10 de maio' }
]

describe('PostsPage', () => {
  it('renders correctly', () => {
    render(
      <Posts posts={posts} />
    )

    expect(screen.getByText("My new post")).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce(
        [{
          uid: 'my-new-post',
          data: {
            title: "My new post",
            content: [
              {
                type: 'paragraph',
                text: 'Post excerpt',
              },
            ]
          },
          last_publication_date: '01-01-2020'
        }]
      )
    } as any);

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            { slug: 'my-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: '01 de janeiro de 2020' }
          ]
        }
      })
    )
  })
})