export default function QuestionMedia({ url }) {
  if (!url) return null
  return (
    <img
      src={url}
      alt="Imagen de la pregunta"
      referrerPolicy="no-referrer"
      style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8, marginBottom: 12 }}
    />
  )
}
