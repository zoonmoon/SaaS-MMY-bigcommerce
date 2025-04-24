function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Generate the data with label same as key but capitalized
  export function generateSpecsData() {
    return {
      store_hash: 'bohaxauo', // Fixed store_hash value
      specs: [
        {
          key: 'year',
          label: capitalizeFirstLetter('year'),
          sort_order: 1
        },
        {
          key: 'make',
          label: capitalizeFirstLetter('make'),
          sort_order: 2
        },
        {
          key: 'model',
          label: capitalizeFirstLetter('model'),
          sort_order: 3
        },
        {
          key: 'engine',
          label: capitalizeFirstLetter('engine'),
          sort_order: 4
        },
        {
          key: 'drive',
          label: capitalizeFirstLetter('drive'),
          sort_order: 5
        }
      ]
    };
  }