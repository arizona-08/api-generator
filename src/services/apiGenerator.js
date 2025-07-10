/**
 * Génère des routes API basées sur la structure d'un objet JSON
 * @param {Object} jsonData - L'objet JSON source
 * @param {String} prefix - Le préfixe pour toutes les routes API
 * @returns {Array} - Un tableau d'objets de route
 */
export function generateApiRoutes(jsonData, prefix) {
    const routes = [];
    const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;

    function traverseObject(obj, path = [], parentPath = '') {
      const currentPath = parentPath + (path.length > 0 ? '/' + path.join('/') : '');

      if (typeof obj === 'object' && obj !== null) {
        routes.push({
          method: 'GET',
          url: `${cleanPrefix}${currentPath}`,
          description: `Récupérer ${path.length > 0 ? path[path.length - 1] : 'toutes les données'}`,
          responseExample: JSON.stringify(obj, null, 2),
          params: []
        });

        if (Array.isArray(obj)) {
          if (obj.length > 0 && typeof obj[0] === 'object') {
            routes.push({
              method: 'GET',
              url: `${cleanPrefix}${currentPath}/{id}`,
              description: `Récupérer un élément spécifique de ${path.length > 0 ? path[path.length - 1] : 'la collection'}`,
              responseExample: JSON.stringify(obj[0], null, 2),
              params: [{
                name: 'id',
                type: 'string/number',
                description: "L'identifiant de l'élément",
                required: true
              }]
            });

            routes.push({
              method: 'POST',
              url: `${cleanPrefix}${currentPath}`,
              description: `Créer un nouvel élément dans ${path.length > 0 ? path[path.length - 1] : 'la collection'}`,
              responseExample: JSON.stringify({ success: true, id: 'new-id' }, null, 2),
              params: [{
                name: 'body',
                type: 'object',
                description: "Les données de l'élément à créer",
                required: true
              }]
            });

            routes.push({
              method: 'PUT',
              url: `${cleanPrefix}${currentPath}/{id}`,
              description: `Mettre à jour un élément existant dans ${path.length > 0 ? path[path.length - 1] : 'la collection'}`,
              responseExample: JSON.stringify({ success: true }, null, 2),
              params: [
                {
                  name: 'id',
                  type: 'string/number',
                  description: "L'identifiant de l'élément",
                  required: true
                },
                {
                  name: 'body',
                  type: 'object',
                  description: "Les données mises à jour",
                  required: true
                }
              ]
            });

            routes.push({
              method: 'DELETE',
              url: `${cleanPrefix}${currentPath}/{id}`,
              description: `Supprimer un élément de ${path.length > 0 ? path[path.length - 1] : 'la collection'}`,
              responseExample: JSON.stringify({ success: true }, null, 2),
              params: [{
                name: 'id',
                type: 'string/number',
                description: "L'identifiant de l'élément à supprimer",
                required: true
              }]
            });
          }

          if (obj.length > 0 && typeof obj[0] === 'object') {
            traverseObject(obj[0], [...path, '{id}'], currentPath);
          }
        } else {
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const newPath = [...path, key];
              const value = obj[key];

              if (typeof value === 'object' && value !== null) {
                traverseObject(value, newPath, currentPath);
              }
            }
          }
        }
      }
    }

    traverseObject(jsonData);
    return routes;
}
