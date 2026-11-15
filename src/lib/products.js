import { supabase, isSupabaseConfigured } from './supabase'
import { DEMO_PRODUCTS } from './demoData'

const DEMO_KEY = 'lina:demo-products'
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

/** Sube la imagen al bucket público y devuelve su URL. */
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

  const path = `${Date.now()}-${safeName || 'producto'}.${extension}`

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

function normalizePayload(values) {
  return {
    name: values.name.trim(),
    description: values.description?.trim() ?? '',
    price: Number(values.price) || 0,
    category: values.category,
    in_stock: Boolean(values.in_stock),
    ...(values.image_url ? { image_url: values.image_url } : {}),
  }
}

export async function createProduct(values, imageFile) {
  const uploadedUrl = await uploadProductImage(imageFile)
  const payload = normalizePayload({ ...values, image_url: uploadedUrl })

  if (!isSupabaseConfigured) {
    const product = {
      ...payload,
      id: `local-${Date.now()}`,
      image_url: uploadedUrl || values.image_url || '/images/product-vela.svg',
      created_at: new Date().toISOString(),
    }
    writeDemo([product, ...readDemo()])
    return product
  }

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProduct(id, values, imageFile) {
  const uploadedUrl = await uploadProductImage(imageFile)
  const payload = normalizePayload({ ...values, image_url: uploadedUrl || values.image_url })

  if (!isSupabaseConfigured) {
    const rows = readDemo().map((p) =>
      p.id === id ? { ...p, ...payload, image_url: uploadedUrl || p.image_url } : p,
    )
    writeDemo(rows)
    return rows.find((p) => p.id === id)
  }

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
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
