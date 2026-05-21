import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt } = body

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt is required'
    })
  }

  try {
    const styleSuffix = ", 3d cartoon style, full body character, action pose, from head to toe, vibrant colors, solid background"
    const fullPrompt = encodeURIComponent(prompt.trim() + styleSuffix)
    const seed = Math.floor(Math.random() * 1000000)
    const url = `https://image.pollinations.ai/prompt/${fullPrompt}?width=512&height=512&model=flux&nologo=true&seed=${seed}`

    console.log(`Server fetching AI image from: ${url}`)
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Pollinations AI image generation failed with status ${res.status}`)
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    
    return {
      success: true,
      image: `data:image/png;base64,${base64}`
    }
  } catch (error: any) {
    console.error('Error in generate-avatar server route:', error)
    return {
      success: false,
      error: error.message || 'Image generation failed'
    }
  }
})
