import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import BasicSimpleTreeView from './render_categories';

import { CheckboxesForAttributeValues, CheckboxesForCategories } from './checkbox_attr_values';

export default function ProductFilters({productFilters, handleAttributesClick, selectedFilters, handleCategoryClick}) {

    const selectedAttrKeysVsValues = selectedFilters.attributes.reduce((acc, curr) => {
        acc[curr.key] = curr.values;
        return acc;
    }, {});

    const handleAttributeItemClick = (key, value) => {

        console.log("attribute item clicked")

        let updatedAttributes = [...selectedFilters.attributes];
      
        const attrIndex = updatedAttributes.findIndex(attr => attr.key === key);
      
        if (attrIndex > -1) {
          const valuesSet = new Set(updatedAttributes[attrIndex].values);
          
          if (valuesSet.has(value)) {
            valuesSet.delete(value);
          } else {
            valuesSet.add(value);
          }
      
          const newValues = Array.from(valuesSet);
      
          if (newValues.length === 0) {
            // Remove the entire key if no values left
            updatedAttributes.splice(attrIndex, 1);
          } else {
            // Update the values
            updatedAttributes[attrIndex].values = newValues;
          }
      
        } else {
          // If key doesn't exist, add new one
          updatedAttributes.push({
            key,
            values: [value]
          });
        }
      
        // Call the parent handler to update filters
        handleAttributesClick(updatedAttributes);
    };


    const uniqueCategories = [
      ...new Map(productFilters.allCategories.map((item) => [item.id, item])).values(),
    ];


    return(
        <div>
          <BasicSimpleTreeView 
            categoryAggregates={productFilters.categories}
            selectedCategories={selectedFilters.categories}
            allCategories={uniqueCategories}
            handleCategoryClick={handleCategoryClick}
          />

            {
                productFilters.attributes.map((attribute, index) => {
                    return(
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id={'for-attribute-'+attribute.key}
                            >
                                <Typography component="span">{attribute.label}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CheckboxesForAttributeValues 
                                    attributeValues={attribute.values}
                                    attributeKey={attribute.key}
                                    selectedAttributes={selectedFilters.attributes}
                                    handleAttributeItemClick={handleAttributeItemClick}
                                    selectedAttrKeysVsValues={selectedAttrKeysVsValues}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </div>
    )

}
