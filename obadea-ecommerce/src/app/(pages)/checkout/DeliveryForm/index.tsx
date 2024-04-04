import React, { useCallback, useState } from 'react'

import classes from './index.module.scss'
import { Button } from '../../../_components/Button'
import { useCart } from '../../../_providers/Cart'
import { priceFromJSON } from '../../../_components/Price'
import { Order } from '../../../../payload/payload-types'
import { useRouter } from 'next/navigation'
import { Message } from '../../../_components/Message'

const DeliveryForm: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { cart, cartTotal } = useCart()
  let currentTime = new Date().getTime()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handlePhoneNumber = (e: any) => {
    setPhoneNumber(e.target.value)
  }
  const handleAddress = (e: any) => {
    setAddress(e.target.value)
  }

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault()
      setIsLoading(true)
      setPhoneNumber(e.target.value)
      setAddress(e.target.value)

      //   readyNumber = phoneNumber
      //   readyAddress = address

      try {
        const orderReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total: cartTotal.raw,
            stripePaymentIntentID: 'Pay on Delivery',
            userPhoneNumber: phoneNumber,
            userAddress: address,
            items: (cart?.items || [])?.map(({ product, quantity }) => ({
              product: typeof product === 'string' ? product : product.id,
              quantity,
              price:
                typeof product === 'object' ? priceFromJSON(product.priceJSON, 1, true) : undefined,
            })),
          }),
        })

        if (!orderReq.ok) throw new Error(orderReq.statusText || 'Something went wrong.')

        const {
          error: errorFromRes,
          doc,
        }: {
          message?: string
          error?: string
          doc: Order
        } = await orderReq.json()

        if (errorFromRes) throw new Error(errorFromRes)

        router.push(`/order-confirmation?order_id=${doc.id}`)
      } catch (err) {
        // don't throw an error if the order was not created successfully
        // this is because payment _did_ in fact go through, and we don't want the user to pay twice
        console.error(err.message) // eslint-disable-line no-console
        setError(err.message)
        router.push(`/order-confirmation?error=${encodeURIComponent(err.message)}`)
      }
    },
    [address, phoneNumber, router, cart, cartTotal],
  )

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {error && <Message error={error} />}
      <label id="First Name">
        First Name
        <input id="First Name" type="text" placeholder="Enter your first name" required />
      </label>
      <label id="Last Name">
        Last Name
        <input id="Last Name" type="text" placeholder="Enter your last name" required />
      </label>
      <label id="Email">
        Email
        <input id="Email" type="email" placeholder="Enter your email" />
      </label>
      <label id="Phone Number">
        Phone Number
        <input
          id="Phone Number"
          type="number"
          placeholder="Enter your phone number"
          required
          onChange={handlePhoneNumber}
        />
      </label>
      <label className={classes.addressLabel} id="Details Address" onChange={handleAddress}>
        Details Address
        <textarea placeholder="Enter your address detail" required />
      </label>

      <div className={classes.actions}>
        <Button label="Back to cart" href="/cart" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Checkout'}
          type="submit"
          appearance="primary"
          disabled={isLoading}
        />
      </div>
    </form>
  )
}

export default DeliveryForm
