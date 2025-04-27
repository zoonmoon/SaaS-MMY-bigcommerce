import React, { useEffect, useState } from "react";
import { AccordionDetails, Collapse, Accordion, AccordionSummary, Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

  
  function buildCategoryTree(categoriesData, nodeIds = []) {
    // Step 1: Create a map of categories by their ID for quick lookup
    const categoriesMap = categoriesData.reduce((map, category) => {
      map[category.id] = { ...category, children: [] };
      return map;
    }, {});
    
    // Step 2: Build the tree based on the nodeIds filter
    const rootNodes = [];
  
    categoriesData.forEach(category => {
      // If nodeIds is provided, skip categories that are not in nodeIds
      if (nodeIds.length > 0 && !nodeIds.includes(category.id.toString())) return;
  
      const categoryNode = categoriesMap[category.id];
      
      if (category.parent_id === null) {
        // If the category has no parent, it's a root node
        rootNodes.push(categoryNode);
      } else {
        // If the category has a parent, find the parent and attach this category as a child
        const parentNode = categoriesMap[category.parent_id];
        if (parentNode) {
          parentNode.children.push(categoryNode);
        }
      }
    });
  
    return rootNodes;
  }


  function getParentIds(tree, targetId) {
    const dfs = (node, targetId, path = []) => {
      if (node.id.toString() === targetId) {
        return path;  // Return the path of parent ids
      }
  
      for (const child of node.children || []) {
        const found = dfs(child, targetId, [...path, node.id]);
        if (found) {
          return found;  // Found the path, return it
        }
      }
  
      return null;  // Return null if not found in this subtree
    };
  
    for (const root of tree) {
      const result = dfs(root, targetId);
      if (result) return result;  // Return the parent path
    }
  
    return null;  // Return null if the node wasn't found
  }
  


export default function BasicSimpleTreeView({handleCategoryClick, categoryAggregates, allCategories, selectedCategories}) {

    console.log("selectedfilters.categories", selectedCategories)

let categoryAggregatesKeyVsCount = {

}

categoryAggregates.forEach(a => {
    categoryAggregatesKeyVsCount[a.key] = a.doc_count
})

console.log(categoryAggregatesKeyVsCount)

  function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  
  const renderCustomTree = (node, level = 0) => {
    const isExpanded = expandedItems.includes(node.id);
    const isLeaf = !node.children || node.children.length === 0;
  
    return (
      <Box key={node.id} sx={{ pl: level * 2 }}>
                          <ListItem
                                secondaryAction={
                                    <span edge="end" aria-label="comments">
                                        {categoryAggregatesKeyVsCount[node.id]}
                                    </span>
                                }
                          
                                sx={{padding: 0}}
                            >
        <ListItemButton sx={{paddingLeft:'0px', paddingTop: isLeaf ? '4px' : '8px', paddingBottom: isLeaf ? '4px': '8px' }}  onClick={() => {toggleExpand(node.id); isLeaf &&  handleCategoryClick(node.id);}}>
        <ListItemIcon  sx={{display:'flex', justifyContent:'center'}} >
            {
                isLeaf ? 
                    <Checkbox  checked={selectedCategories.includes(node.id)} />
                :
                    isExpanded ? <KeyboardArrowDownIcon  /> : <KeyboardArrowRightIcon />
            }

          </ListItemIcon>
            <ListItemText primary={node.name} />
        </ListItemButton>
            </ListItem>
        {/* Recursive render if expanded and has children */}
        {!isLeaf && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {node.children.map((child) => renderCustomTree(child, level + 1))}
          </Collapse>
        )}
      </Box>
    );
  };


    const expendadItemsTempFunc = () => {
        let expandedItemsTemp = [];

        if(selectedCategories.length){
    
            let parentIds  = getParentIds(treeToRender, selectedCategories[0].toString() )
            if(parentIds){
                expandedItemsTemp = [selectedCategories[0], ...parentIds]
            }
        }
    
        return  expandedItemsTemp.map(m => parseInt(m))
    }

    const toggleExpand = (id) => {
        setExpandedItems((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };


    let  treeToRender  = buildCategoryTree(allCategories, categoryAggregates.map(c => c.key))

    useEffect(()=> {
        setExpandedItems(expendadItemsTempFunc())
    }, [selectedCategories])



    const [expandedItems, setExpandedItems] = useState(expendadItemsTempFunc())


    console.log("expandeditems", expandedItems)


    const handleExpandedItemsChange = (event, itemIds) => {
    setExpandedItems(itemIds);
  };


  return (
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id={'for-category'}
        >
            <Typography component="span">Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {/*}
            <Box>
                <SimpleTreeView 
                    expandedItems={expandedItems} 
                    onExpandedItemsChange={handleExpandedItemsChange}             
                >
                    {treeToRender.map((node) => renderTree(node))} 
                </SimpleTreeView>
            </Box>
            {*/}
            {treeToRender.map((node) => renderCustomTree(node))} 
        </AccordionDetails>
    </Accordion>
  );
}
