export const productsSchema = {
    properties: {
      store_hash: {type: "keyword"},
      id: {type: "keyword"},
      name: { type: "text" },
      description: { type: "text" },
      price: { type: "float" },
      stock: { type: "integer" },
      categories: { type: "keyword" },
      attributes: {
        type: "nested",
        properties: {
          key: { type: "keyword" },
          label: {type: "text" },
          value_key: { type: "keyword" },
          value_label: {type: "text"}
        }
      },
      images: { type: "keyword" }
    }
}

export const categoriesSchema = {
    properties: {
        store_hash: { type: "keyword" },
        id: { type: "keyword" },
        name: { type: "text" },
        parent_id: { type: "keyword" },
        path: { type: "keyword"}
    }
}

