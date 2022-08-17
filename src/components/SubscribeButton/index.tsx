import { signIn, useSession } from "next-auth/react"
import { api } from "../../services/api"
import { getStripeJs } from "../../services/stripe-js"
import styles from "./styles.module.scss"

interface SubscribeButtonProps {
  priceId: string
}

export const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
  const session = useSession()

  const handleSubscribe = async () => {
    if (!session.data) {
      signIn("github")
      return
    }

    try {
      const response = await api.post("/subscribe")
      const { sessionId } = response.data
      const stripe = await getStripeJs()
      stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}
