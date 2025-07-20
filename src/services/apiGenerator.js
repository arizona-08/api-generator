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
              requestExample: JSON.stringify(generateRequestExample(obj[0]), null, 2),
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
              requestExample: JSON.stringify(generateRequestExample(obj[0]), null, 2),
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
          // Ne pas traverser plus profondément pour les tableaux pour éviter la duplication
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

/**
 * Génère un exemple de requête (request body) basé sur un objet exemple
 * @param {Object} exampleObject - Un objet exemple de la collection
 * @returns {Object} - Un objet exemple pour la requête
 */
function generateRequestExample(exampleObject) {
  if (!exampleObject || typeof exampleObject !== 'object') {
    return {};
  }

  const requestExample = {};
  
  for (const [key, value] of Object.entries(exampleObject)) {
    // Ignorer l'ID pour les exemples de requête (généré automatiquement)
    if (key.toLowerCase() === 'id') {
      continue;
    }
    
    // Générer des valeurs d'exemple basées sur le type et le nom du champ
    if (typeof value === 'string') {
      requestExample[key] = generateStringExample(key, value);
    } else if (typeof value === 'number') {
      requestExample[key] = generateNumberExample(key, value);
    } else if (typeof value === 'boolean') {
      requestExample[key] = true;
    } else if (Array.isArray(value)) {
      requestExample[key] = value.length > 0 ? [value[0]] : [];
    } else if (typeof value === 'object' && value !== null) {
      requestExample[key] = generateRequestExample(value);
    } else {
      requestExample[key] = value;
    }
  }
  
  return requestExample;
}

/**
 * Génère un exemple de chaîne basé sur le nom du champ
 * @param {string} fieldName - Le nom du champ
 * @param {string} originalValue - La valeur originale
 * @returns {string} - Un exemple de valeur
 */
function generateStringExample(fieldName, originalValue) {
  const field = fieldName.toLowerCase();
  
  if (field.includes('name') || field.includes('nom')) {
    return 'Nouveau nom';
  } else if (field.includes('email') || field.includes('mail')) {
    return 'nouveau@example.com';
  } else if (field.includes('title') || field.includes('titre')) {
    return 'Nouveau titre';
  } else if (field.includes('description') || field.includes('desc')) {
    return 'Nouvelle description';
  } else if (field.includes('content') || field.includes('contenu')) {
    return 'Nouveau contenu';
  } else if (field.includes('author') || field.includes('auteur')) {
    return 'Nouvel auteur';
  } else if (field.includes('category') || field.includes('categorie')) {
    return 'Nouvelle catégorie';
  } else {
    // Utiliser un exemple générique basé sur la valeur originale
    return `Nouveau ${fieldName.toLowerCase()}`;
  }
}

/**
 * Génère un exemple de nombre basé sur le nom du champ
 * @param {string} fieldName - Le nom du champ
 * @param {number} originalValue - La valeur originale
 * @returns {number} - Un exemple de valeur
 */
function generateNumberExample(fieldName, originalValue) {
  const field = fieldName.toLowerCase();
  
  if (field.includes('price') || field.includes('prix')) {
    return 29.99;
  } else if (field.includes('age')) {
    return 25;
  } else if (field.includes('quantity') || field.includes('quantite')) {
    return 10;
  } else if (field.includes('score') || field.includes('note')) {
    return 4.5;
  } else {
    // Utiliser une valeur similaire à l'originale
    return typeof originalValue === 'number' ? Math.round(originalValue * 1.1) : 100;
  }
}
