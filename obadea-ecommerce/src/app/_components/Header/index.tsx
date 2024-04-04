{
  /* eslint-disable @next/next/no-img-element */
}

import { APIError } from 'payload/errors'

class MySpecialError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}

import { Header } from '../../../payload/payload-types'
import { fetchHeader } from '../../_api/fetchGlobals'
import HeaderComponent from './HeaderComponent'

export async function Header() {
  let header: Header | null = null

  try {
    header = await fetchHeader()
  } catch (error) {
    throw new MySpecialError(error.message)
  }

  return (
    <>
      <HeaderComponent header={header} />
    </>
  )
}
