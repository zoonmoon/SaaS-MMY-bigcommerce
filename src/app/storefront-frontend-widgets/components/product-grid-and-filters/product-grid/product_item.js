import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const parts = [
  "Engine", "Transmission", "Radiator", "Alternator", "Starter motor", "Battery", "Fuel pump", "Water pump",
  "Spark plug", "Timing belt", "Serpentine belt", "Air filter", "Oil filter", "Fuel filter", "Muffler",
  "Catalytic converter", "Exhaust manifold", "Camshaft", "Crankshaft", "Cylinder head", "Pistons", "Turbocharger",
  "Supercharger", "Intercooler", "Intake manifold", "Throttle body", "Mass air flow sensor", "Oxygen sensor",
  "Knock sensor", "Idle air control valve", "EGR valve", "PCV valve", "Thermostat", "Radiator fan", "Radiator hose",
  "Heater core", "HVAC blower motor", "AC compressor", "AC condenser", "Power steering pump", "Steering rack",
  "Steering column", "Tie rod", "Ball joint", "Control arm", "Sway bar", "Shock absorber", "Strut", "Coil spring",
  "Leaf spring", "Brake pad", "Brake rotor", "Brake caliper", "Brake drum", "Master cylinder", "ABS sensor",
  "Brake booster", "Clutch", "Flywheel", "Pressure plate", "Throwout bearing", "Drive shaft", "CV joint",
  "Axle shaft", "Differential", "Transfer case", "Hub assembly", "Wheel bearing", "Rim", "Tire", "Lug nut",
  "Fender", "Bumper", "Grille", "Hood", "Trunk lid", "Spoiler", "Windshield", "Side mirror", "Headlight",
  "Tail light", "Turn signal", "Fog light", "Dashboard", "Speedometer", "Tachometer", "Fuel gauge", "Gear shifter",
  "Handbrake lever", "Car seat", "Seatbelt", "Airbag", "Steering wheel", "Floor mat", "Door handle",
  "Window motor", "Wiper blade", "Washer pump", "Fuse box", "ECU"
];

export default function ProductCard({product}) {

  const randomPart = parts[Math.floor(Math.random() * parts.length)];
  
  return (
    <Card>
      <CardMedia
        sx={{ height: 200 }}
        image={product.thumbnail}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant={'body1'} component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ${product.price}.00
        </Typography>
        {/* <div>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Fits On:</Typography>
          <ul>
            {
              Object.values(product.fits_on_specs)
              .map((spec,index) => (<li key={index}>{spec.hash}</li>))
            }
          </ul>
        </div> */}
        <div>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Product Specifications:</Typography>
          <ul>
            {
              product.attributes
              .map((attribute,index) => (<li key={index}>{attribute.label}: {attribute.value_label}</li>))
            }
          </ul>
        </div>

      </CardContent>
    </Card>
  );
}
