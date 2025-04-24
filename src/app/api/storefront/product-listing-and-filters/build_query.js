export function buildOpenSearchQuery({
    storeHash,
    selectedCategories,
    selectedFitsOnSpecs,
    selectedAttributes,
    currentPage
  }) {
    const filters = [];
  
    // Store hash filter
    if (storeHash) {
      filters.push({ term: { store_hash: storeHash } });
    }
  
    // Category filter
    if (selectedCategories.length > 0) {
      filters.push({
        terms: { categories: selectedCategories }
      });
    }
    
    // fits_on_specs filter
    if (selectedFitsOnSpecs.length > 0) {
      const fitsFilters = selectedFitsOnSpecs.map(spec => ({
        term: { [`fits_on_specs.${spec.key}.value_key`]: spec.value }
      }));
  
      filters.push({
        nested: {
          path: "fits_on_specs",
          query: {
            bool: {
              must: fitsFilters
            }
          }
        }
      });
    }


    selectedAttributes.forEach(attr => {
        filters.push({
          nested: {
            path: "attributes",
            query: {
              bool: {
                must: [
                  { term: { "attributes.key": attr.key } },
                  { terms: { "attributes.value_key": attr.values } }
                ]
              }
            }
          }
        });
      });
      
  
    return {
      size: 24,
      from: (currentPage - 1) * 24, // 👈 offset calculation
      query: {
        bool: {
          filter: filters
        }
      },
      aggs: {
        categories: {
          terms: {
            field: "categories"
          }
        },
        attributes: {
          nested: {
            path: "attributes"
          },
          aggs: {
            by_key: {
              terms: { field: "attributes.key" },
              aggs: {
                values: {
                  terms: { field: "attributes.value_key" }
                }
              }
            }
          }
        }
      }
    };
  }