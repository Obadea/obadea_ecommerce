'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { useTheme } from '../../../_providers/Theme'
import cssVariables from '../../../cssVariables'
import { CheckoutForm } from '../CheckoutForm'
import { CheckoutItem } from '../CheckoutItem'

import classes from './index.module.scss'
import { RadioButton } from '../../../_components/Radio'
import Image from 'next/image'
import DeliveryForm from '../DeliveryForm'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export const CheckoutPage: React.FC<{
  settings: Settings
}> = props => {
  const {
    settings: { productsPage },
  } = props

  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [clientSecret, setClientSecret] = React.useState()
  const hasMadePaymentIntent = React.useRef(false)
  const { theme } = useTheme()

  const { cart, cartIsEmpty, cartTotal } = useCart()

  // note:me too
  const [paymentOption, setPaymentOption] = useState<'stripe' | 'delivery'>('stripe')
  // note:

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  useEffect(() => {
    if (user && cart && hasMadePaymentIntent.current === false) {
      hasMadePaymentIntent.current = true

      const makeIntent = async () => {
        try {
          const paymentReq = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`,
            {
              method: 'POST',
              credentials: 'include',
            },
          )

          const res = await paymentReq.json()

          if (res.error) {
            setError(res.error)
          } else if (res.client_secret) {
            setError(null)
            setClientSecret(res.client_secret)
          }
        } catch (e) {
          setError('Something went wrong.')
        }
      }

      makeIntent()
    }
  }, [cart, user])

  if (!user || !stripe) return null

  // note:Mine

  const handlePaymentOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentOption(event.target.value as 'stripe' | 'delivery')
  }

  return (
    <Fragment>
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/cart">cart</Link>
          {' is empty.'}
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      )}
      {!cartIsEmpty && (
        <div className={classes.items}>
          <div className={classes.header}>
            <h3>Products</h3>
            <div className={classes.headerItemDetails}>
              <p></p>
              <p className={classes.quantity}>Quantity</p>
            </div>
            <p className={classes.subtotal}>Subtotal</p>
          </div>

          <ul>
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object') {
                const {
                  quantity,
                  product,
                  product: { title, meta },
                } = item

                if (!quantity) return null

                const metaImage = meta?.image

                return (
                  <Fragment key={index}>
                    <CheckoutItem
                      product={product}
                      title={title}
                      metaImage={metaImage}
                      quantity={quantity}
                      index={index}
                    />
                  </Fragment>
                )
              }
              return null
            })}
            <div className={classes.orderTotal}>
              <p>Order Total</p>
              <p>{cartTotal.formatted}</p>
            </div>
          </ul>
        </div>
      )}

      {/* note: Pay on delivery */}
      <h3>Payment Method ({paymentOption})</h3>
      <div className={classes.paymentOptionContainer}>
        <label id="stripe">
          <input
            type="radio"
            className={classes.radio}
            id="stripe"
            value="stripe"
            checked={paymentOption === 'stripe'}
            name="checkout"
            onChange={handlePaymentOptionChange}
          />
          <Image
            className={classes.paymentIcon}
            src="/assets/icons/credit-card.png"
            alt="credit card"
            width={30}
            height={30}
          />
          Credit Card
        </label>

        <label id="delivery">
          <input
            type="radio"
            className={classes.radio}
            id="delivery"
            name="checkout"
            value="delivery"
            checked={paymentOption === 'delivery'}
            onChange={handlePaymentOptionChange}
          />
          <Image
            className={classes.paymentIcon}
            src="/assets/icons/cash-on-delivery.png"
            alt="credit card"
            width={28}
            height={28}
          />
          Cash on Delivery
        </label>
      </div>

      {/* note: Pay on delivery */}

      {!clientSecret && !error && (
        <div className={classes.loading}>
          <LoadingShimmer number={2} />
        </div>
      )}
      {!clientSecret && error && (
        <div className={classes.error}>
          <p>{`Error: ${error}`}</p>
          <Button label="Back to cart" href="/cart" appearance="secondary" />
        </div>
      )}

      {clientSecret && paymentOption === 'stripe' && (
        <Fragment>
          <h3 className={classes.payment}>Payment Details</h3>
          {error && <p>{`Error: ${error}`}</p>}
          <Elements
            stripe={stripe}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorText:
                    theme === 'dark' ? cssVariables.colors.base0 : cssVariables.colors.base1000,
                  fontSizeBase: '16px',
                  fontWeightNormal: '500',
                  fontWeightBold: '600',
                  colorBackground:
                    theme === 'dark' ? cssVariables.colors.base850 : cssVariables.colors.base0,
                  fontFamily: 'Inter, sans-serif',
                  colorTextPlaceholder: cssVariables.colors.base500,
                  colorIcon:
                    theme === 'dark' ? cssVariables.colors.base0 : cssVariables.colors.base1000,
                  borderRadius: '0px',
                  colorDanger: cssVariables.colors.error500,
                  colorDangerText: cssVariables.colors.error500,
                },
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </Fragment>
      )}
      {clientSecret && paymentOption === 'delivery' && (
        <Fragment>
          <DeliveryForm />
        </Fragment>
      )}
    </Fragment>
  )
}
