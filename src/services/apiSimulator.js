import { useApiStore } from '../stores/apiStore';

class ApiSimulator {
  /**
   * @param {object} route - Le modèle de la route (ex: { method: 'GET', url: '/api/v1/users/{id}' }).
   * @param {object} params - Les valeurs des paramètres (ex: { id: '1' }).
   * @param {object} body - Le corps de la requête pour POST/PUT.
   */
  request(route, params, body = null) {
    const apiStore = useApiStore();
    const { documentation } = apiStore;

    if (!documentation?.jsonData) {
      return { status: 503, data: { error: "Simulateur non initialisé." } };
    }

    const dataCopy = JSON.parse(JSON.stringify(documentation.jsonData));
    const prefix = documentation.apiPrefix.endsWith('/') ? documentation.apiPrefix.slice(0, -1) : documentation.apiPrefix;
    
    switch (route.method.toUpperCase()) {
      case 'GET':    return this.handleGet(route, params, dataCopy, prefix);
      case 'POST':   return this.handlePost(route, params, body, dataCopy, prefix);
      case 'PUT':    return this.handlePut(route, params, body, dataCopy, prefix);
      case 'DELETE': return this.handleDelete(route, params, dataCopy, prefix);
      default:       return { status: 405, data: { error: 'Méthode non supportée' } };
    }
  }
  
  handleGet(route, params, data, prefix) {
    let resolvedPath = route.url.substring(prefix.length);
    for (const [key, value] of Object.entries(params)) {
        resolvedPath = resolvedPath.replace(`{${key}}`, value);
    }
    const resultData = this.getDataFromPath(resolvedPath, data);
    if (resultData === null) {
        return { status: 404, data: { error: 'Ressource non trouvée' } };
    }
    return { status: 200, data: resultData };
  }

  getDataFromPath(path, baseData) {
    const segments = path.split('/').filter(Boolean);
    let currentData = baseData;
    for (const segment of segments) {
        if (currentData === null) return null;
        if (Array.isArray(currentData)) {
            const item = currentData.find(el => String(el.id) === String(segment));
            currentData = item !== undefined ? item : null;
        } else if (typeof currentData === 'object' && currentData[segment] !== undefined) {
            currentData = currentData[segment];
        } else {
            return null;
        }
    }
    return currentData;
  }
  
  handlePost(route, params, body, data, prefix) {
    if (!body) return { status: 400, data: { error: 'Corps de requête requis' } };
    const collectionPath = route.url.substring(prefix.length);
    const collection = this.getDataFromPath(collectionPath, data);
    if (!Array.isArray(collection)) return { status: 400, data: { error: 'La cible n\'est pas une collection' } };

    const newId = collection.length > 0 ? Math.max(...collection.map(item => Number(item.id) || 0)) + 1 : 1;
    const newItem = { ...body, id: newId };
    collection.push(newItem);

    useApiStore().updateJsonData(data);
    return { status: 201, data: newItem };
  }

  handlePut(route, params, body, data, prefix) {
    if (!body) return { status: 400, data: { error: 'Corps de requête requis' } };
    const collectionPath = route.url.substring(prefix.length).split('/').slice(0, -1).join('/');
    const collection = this.getDataFromPath(collectionPath, data);
    if (!Array.isArray(collection)) return { status: 404, data: { error: 'Collection non trouvée' } };
    
    const index = collection.findIndex(el => String(el.id) === String(params.id));
    if (index === -1) return { status: 404, data: { error: 'Élément non trouvé' } };
    
    collection[index] = { ...collection[index], ...body, id: collection[index].id };
    useApiStore().updateJsonData(data);
    return { status: 200, data: collection[index] };
  }

  handleDelete(route, params, data, prefix) {
    const collectionPath = route.url.substring(prefix.length).split('/').slice(0, -1).join('/');
    const collection = this.getDataFromPath(collectionPath, data);
    if (!Array.isArray(collection)) return { status: 404, data: { error: 'Collection non trouvée' } };

    const index = collection.findIndex(el => String(el.id) === String(params.id));
    if (index === -1) return { status: 404, data: { error: 'Élément non trouvé' } };

    const deletedItem = collection.splice(index, 1);
    useApiStore().updateJsonData(data);
    return { status: 200, data: { success: true, deleted: deletedItem[0] } };
  }
}

export default new ApiSimulator();