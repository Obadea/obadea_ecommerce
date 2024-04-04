import classes from './index.module.scss'
import { Gutter } from '../../_components/Gutter'
import Filters from './Filters'
import { Blocks } from '../../_components/Blocks'
import { Category, Page } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { draftMode } from 'next/headers'
import { fetchDocs } from '../../_api/fetchDocs'
import { HR } from '../../_components/HR'
import { APIError } from 'payload/errors'

const Products = async () => {
  class MySpecialError extends APIError {
    constructor(message: string) {
      super(message, 400, undefined, true)
    }
  }

  const { isEnabled: isDraftMode } = draftMode()
  let page: Page | null = null
  let categories: Category[] | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'products',
      draft: isDraftMode,
    })

    categories = await fetchDocs<Category>('categories')
  } catch (error) {
    throw new MySpecialError(error.message)
  }

  return (
    <div className={classes.container}>
      <Gutter className={classes.products}>
        <Filters categories={categories} />
        <Blocks blocks={page.layout} disableTopPadding={true} />
      </Gutter>
      <HR />
    </div>
  )
}

export default Products
