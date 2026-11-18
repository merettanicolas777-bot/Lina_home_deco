import { supabase, isSupabaseConfigured } from './supabase'
import { DEMO_PRODUCTS } from './demoData'

const DEMO_KEY = 'lina:demo-products-v2'
export const IMAGE_BUCKET = 'product-images'

function readDemo() {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* almacenamiento no disponible */
  }
  writeDemo(DEMO_PRODUCTS)
  return [...DEMO_PRODUCTS]
}

function writeDemo(rows) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(rows))
  } catch {
    /* almacenamiento no disponible */
  }
}

function sortByDate(rows) {
  return [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function fetchProducts() {
  if (!isSupabaseConfigured) {
    return sortByDate(readDemo())
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchProduct(id) {
  if (!isSupabaseConfigured) {
    return readDemo().find((p) => p.id === id) ?? null
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

/** Sube una imagen al bucket público y devuelve su URL. */
export async function uploadProductImage(file) {
  if (!file) return null

  if (!isSupabaseConfigured) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('No pudimos leer la imagen.'))
      reader.readAsDataURL(file)
    })
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName || 'producto'}.${extension}`

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Resuelve las fotos en el orden elegido: sube las nuevas y conserva las existentes. */
export async function resolveImages(entries = []) {
  const urls = []

  for (const entry of entries) {
    if (entry?.file) {
      const uploaded = await uploadProductImage(entry.file)
      if (uploaded) urls.push(uploaded)
    } else if (entry?.url) {
      urls.push(entry.url)
    }
  }

  return urls
}

function normalizePayload(values) {
  const images = Array.isArray(values.images) ? values.images.filter(Boolean) : []

  return {
    name: values.name.trim(),
    description: values.description?.trim() ?? '',
    price: Number(values.price) || 0,
    category: values.category,
    in_stock: Boolean(values.in_stock),
    image_url: images[0] ?? null,
    images,
  }
}

const needsImagesColumn = (message = '') =>
  /images/i.test(message) && /(column|schema|cache)/i.test(message)

async function insertProduct(payload) {
  const { data, error } = await supabase.from('products').insert(payload).select().single()

  if (error) {
    // Respaldo por si todavía no se corrió la migración de `images`.
    if (needsImagesColumn(error.message)) {
      const { images, ...rest } = payload
      const retry = await supabase.from('products').insert(rest).select().single()
      if (retry.error) throw new Error(retry.error.message)
      return { ...retry.data, images }
    }
    throw new Error(error.message)
  }

  return data
}

async function updateProductRow(id, payload) {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (needsImagesColumn(error.message)) {
      const { images, ...rest } = payload
      const retry = await supabase.from('products').update(rest).eq('id', id).select().single()
      if (retry.error) throw new Error(retry.error.message)
      return { ...retry.data, images }
    }
    throw new Error(error.message)
  }

  return data
}

export async function createProduct(values, entries = []) {
  const images = await resolveImages(entries)
  const payload = normalizePayload({ ...values, images })

  if (!isSupabaseConfigured) {
    const product = {
      ...payload,
      id: `local-${Date.now()}`,
      image_url: images[0] ?? '/images/product-vela.svg',
      created_at: new Date().toISOString(),
    }
    writeDemo([product, ...readDemo()])
    return product
  }

  return insertProduct(payload)
}

export async function updateProduct(id, values, entries = []) {
  const images = await resolveImages(entries)
  const payload = normalizePayload({ ...values, images })

  if (!isSupabaseConfigured) {
    const rows = readDemo().map((product) =>
      product.id === id ? { ...product, ...payload } : product,
    )
    writeDemo(rows)
    return rows.find((product) => product.id === id)
  }

  return updateProductRow(id, payload)
}

export async function setProductStock(id, inStock) {
  if (!isSupabaseConfigured) {
    const rows = readDemo().map((p) => (p.id === id ? { ...p, in_stock: inStock } : p))
    writeDemo(rows)
    return
  }

  const { error } = await supabase.from('products').update({ in_stock: inStock }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured) {
    writeDemo(readDemo().filter((p) => p.id !== id))
    return
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
