import { Footer } from '../../../payload/payload-types'
import { fetchFooter } from '../../_api/fetchGlobals'
import FooterComponent from './FooterComponent'
import { APIError } from 'payload/errors'

class MySpecialError extends APIError {
  constructor(message: any) {
    super(message, 400, undefined, true)
  }
}

export async function Footer() {
  let footer: Footer | null = null

  try {
    footer = await fetchFooter()
  } catch (error) {
    throw new MySpecialError(error.message)
  }

  const navItems = footer?.navItems || []

  return (
    <>
      <FooterComponent footer={footer} />
    </>
  )
}
