/* eslint-disable @next/next/no-img-element */
import { Product } from '@/data/types/product'
import { api } from '@/data/api'
import { env } from '@/env'
import colors from 'tailwindcss/colors'
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Compre na Devstore!'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 10, // 10 seconds
    },
  })

  const products = await response.json()

  return products
}

export default async function OgImage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  const productImageURL = new URL(product.image, env.APP_URL).toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img
          src={productImageURL}
          alt=""
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    ),
    {
      ...size,
    },
  )
}
