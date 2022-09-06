import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock("next-auth/react")
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

const post = { slug: 'my-new-post', title: 'My new post', content: '<p>Post excerpt</p>', updatedAt: '10 de maio' }

describe('PostPreviewPage', () => {
  it('renders correctly', () => {

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null
    } as any)

    render(
      <PostPreview post={post} />
    )

    expect(screen.getByText("My new post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription'
      }
    } as any)

    const pushMock = jest.fn()
    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <PostPreview post={post} />
    )

    expect(pushMock).toHaveBeenCalled()

  })

  it('loads initial data', async () => {
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

    const response = await getStaticProps({
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