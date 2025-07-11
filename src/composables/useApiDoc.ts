export function useApiDoc() {

  const getMethodDescription = (method: string): string => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'Méthode : GET (lecture)'
      case 'POST':
        return 'Méthode : POST (création)'
      case 'PUT':
        return 'Méthode : PUT (modification)'
      case 'DELETE':
        return 'Méthode : DELETE (suppression)'
      default:
        return `Méthode : ${method.toUpperCase()}`
    }
  }

  return {
    getMethodDescription
  }
}
