import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

export  function CheckboxesForAttributeValues({attributeKey, attributeValues, selectedAttrKeysVsValues, handleAttributeItemClick}){
    return(
        <>
            {
                attributeValues.map((value, index) => {
                    const labelId = 'attribute-value' + '-' + attributeKey + '-'+ value.key + '-' + index
                    return(
                        <label 
                            key={index}
                            htmlFor={labelId}
                        >
                            <ListItem
                                secondaryAction={
                                    <span edge="end" aria-label="comments">
                                        {value.total_hits}
                                    </span>
                                }
                                disablePadding
                            >
                                <ListItemButton style={{paddingLeft:'0px'}} role={undefined}  dense>
                                    <ListItemIcon style={{display:'flex', justifyContent:'center'}}>
                                        <Checkbox
                                            onClick={() => handleAttributeItemClick(attributeKey, value.key)}
                                            tabIndex={-1}
                                            id={labelId}
                                            checked={selectedAttrKeysVsValues[attributeKey]?.includes(value.key) || false}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary= {value.label} />
                                </ListItemButton>
                            </ListItem>
                        </label>
                    )
                })
            }
        </>
    )
}