import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock("next-auth/react")

const post = { slug: 'my-new-post', title: 'My new post', content: '<p>Post excerpt</p>', updatedAt: '10 de maio' }

describe('PostPage', () => {
  it('renders correctly', () => {
    render(
      <Post post={post} />
    )

    expect(screen.getByText("My new post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    } as any)

    const response = await getServerSideProps({
      req: {
        cookies: {}
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/"
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: "Fake title 1",
          content: [
            {
              type: 'paragraph',
              text: 'Fake excerpt 1',
            },
          ]
        },
        last_publication_date: '01-01-2020'
      })
    } as any);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post', title: 'Fake title 1', content: 'Fake excerpt 1', updatedAt: '01 de janeiro de 2020'
          }
        }
      })
    )
  })
})