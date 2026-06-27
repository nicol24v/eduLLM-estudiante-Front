function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

export default function QuestionMedia({ url }) {
  if (!url) return null
  const src = decodeHtmlEntities(url)
  return (
    <img
      src={src}
      alt="Imagen de la pregunta"
      referrerPolicy="no-referrer"
      style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8, marginBottom: 12 }}
    />
  )
}
