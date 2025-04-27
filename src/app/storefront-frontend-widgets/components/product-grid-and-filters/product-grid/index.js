import { Grid } from "@mui/material";
import ProductCard from "./product_item";

export default function ProductGrid({products}){
    return(
        <Grid container spacing={2}>
            {
                products.map((product, index) => (
                    <Grid key={index} item size={{ xs: 12, md: 4 }}>
                        <ProductCard product={product} key={index} />
                    </Grid>
                ))
            }
        </Grid>
    )
}