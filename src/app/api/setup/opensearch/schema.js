export const productsSchema = {
    properties: {
      store_hash: {type: "keyword"},
      id: {type: "keyword"},
      name: { type: "text" },
      description: { type: "text" },
      link: {type: "keyword"},
      price: { type: "float" },
      stock: { type: "integer" },
      categories: { type: "keyword" },
      fits_on_specs: {type: "nested", dynamic: true},
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

export const specsRows = {
  properties: {
    store_hash: {type: "keyword"},
    row: {type: "object", dynamic: true}
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

export const usersSchema = {
  properties: {
    username: {type: "keyword"},
    name: {type: "keyword"},
    email: {type: "keyword"},
    password: {type: "text"}
  }
}

export const storesSchema = {
  properties: {
    username: {type: "keyword"},
    store_hash: {type: "keyword"},
    store_name: {type: "text"},
    access_token: {type: "text"},
    spreadsheet_url:  {type: "text"},
    last_indexed_at: {type: "text"},
    specs: {
      type: "nested", 
      properties: {
        key: { type: "keyword" },
        label: { type: "text"},
        sort_order: { type: "integer"}
      }
    },
    product_id_column: {type: "keyword"}
  }
}

