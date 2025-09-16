  export const getSanityColor = (sanity: number) => {
    if (sanity > 70) return "bg-green-500"
    if (sanity > 40) return "bg-amber-500"
    if (sanity > 20) return "bg-destructive"
    return "bg-red-900"
  }

  export const getSanityText = (sanity: number) => {
    if (sanity > 80) return "Estable"
    if (sanity > 60) return "Nervioso"
    if (sanity > 40) return "Ansioso"
    if (sanity > 20) return "Perturbado"
    return "Al borde de la locura"
  }

  export const validateName = (name: string) => {
    const regex = /^[a-zA-Z0-9\s]*$/
    return regex.test(name)
  }

  export const countCharacters = (text: string) => {
    return text.length
  }