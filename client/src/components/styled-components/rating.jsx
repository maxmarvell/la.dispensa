import { Rating } from "@mui/material"
import { styled } from '@mui/material/styles';


const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#020617',
  },
  '& .MuiRating-iconHover': {
    color: '#0f172a',
  },
});

export const LightStyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#CBD5E1',
  },
  '& .MuiRating-iconHover': {
    color: '#CBD5E1',
  },
});


export default StyledRating