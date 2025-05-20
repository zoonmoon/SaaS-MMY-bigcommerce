import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

export default function CustomizedInputBase({handleClick, searchQueryParent}) {

    const [searchquery, setSearchQuery]= React.useState('')

    React.useEffect(() => {setSearchQuery(searchQueryParent)}, [searchQueryParent])

    const handleSubmit = () => handleClick(searchquery)

    const handleChange = (e) => setSearchQuery(e.target.value)
    const [focused, setFocused] = React.useState(false);

  return (
    <Paper
      component="form"
      onSubmit={(e) => {e.preventDefault();handleSubmit();}}
      elevation={focused ? 3: 0}
      sx={{ border:`${!focused ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0)'}`, p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
    >
      <InputBase
        onChange={handleChange}
        sx={{ ml: 1, flex: 1, }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={searchquery}
        placeholder="Search stores"
        inputProps={{ 'aria-label': 'search stores' }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton onClick={handleSubmit} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}