import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Module = {
  title: string;
  description: string;
};

type CourseModulesProps = {
  modules: Module[];
};

const CourseModules = ({ modules }: CourseModulesProps) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ color: '#173F60', fontWeight: 700, mb: 2.5 }}
      >
        Course structure
      </Typography>

      {modules.map((module, index) => (
        <Accordion
          key={module.title}
          elevation={0}
          sx={{
            border: '1px solid #DCE6ED',
            '&:before': { display: 'none' },
            mb: 1,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ color: '#244A66', fontWeight: 600 }}>
              Module {index + 1}: {module.title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ color: '#657887', lineHeight: 1.7 }}
            >
              {module.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CourseModules;
