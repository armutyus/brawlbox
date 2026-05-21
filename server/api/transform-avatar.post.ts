import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { image, prompt } = body // image is a base64 DataURL

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image data is required'
    })
  }

  try {
    // 1. Decode base64 image data
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format')
    }
    const contentType = matches[1]
    const base64Data = matches[2]
    const fileBuffer = Buffer.from(base64Data, 'base64')

    // 2. Upload to uguu.se for temporary hosting (expires in 3 hours)
    console.log('Server: Uploading image to Uguu media server...')
    
    // Create FormData manually
    const formData = new FormData()
    // We create a Blob from the Buffer for the standard FormData interface in Node
    const fileBlob = new Blob([fileBuffer], { type: contentType })
    formData.append('files[]', fileBlob, 'uploaded_face.png')

    const uploadRes = await fetch('https://uguu.se/upload', {
      method: 'POST',
      body: formData
    })

    if (!uploadRes.ok) {
      throw new Error(`Uguu media upload failed with status ${uploadRes.status}`)
    }

    const uploadData: any = await uploadRes.json()
    if (!uploadData.success || !uploadData.files || uploadData.files.length === 0) {
      throw new Error('Uguu media upload was unsuccessful')
    }
    
    const mediaUrl = uploadData.files[0].url
    console.log('Server: Uploaded image public URL:', mediaUrl)

    // 3. Make Image-to-Image request using p-image-edit model
    const styleSuffix = ", 3d cartoon style, full body character, action pose, from head to toe, vibrant colors, solid background"
    const fullPrompt = encodeURIComponent((prompt || 'Brawl Stars character').trim() + styleSuffix)
    const seed = Math.floor(Math.random() * 1000000)

    const transformUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?model=p-image-edit&image=${encodeURIComponent(mediaUrl)}&width=512&height=512&nologo=true&seed=${seed}`
    console.log('Server: Fetching transformed image from:', transformUrl)

    const transformRes = await fetch(transformUrl)
    if (!transformRes.ok) {
      const errText = await transformRes.text()
      console.error('Server: Transformation model error response:', errText)
      throw new Error(`Brawler transformation model failed with status ${transformRes.status}`)
    }

    const arrayBuffer = await transformRes.arrayBuffer()
    const transformedBuffer = Buffer.from(arrayBuffer)
    const transformedBase64 = transformedBuffer.toString('base64')

    return {
      success: true,
      image: `data:image/png;base64,${transformedBase64}`
    }
  } catch (error: any) {
    console.error('Error in transform-avatar server route:', error)
    return {
      success: false,
      error: error.message || 'Image transformation failed'
    }
  }
})
