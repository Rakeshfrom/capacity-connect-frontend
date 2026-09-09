import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

type CourseCardProps = {
  courseId: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  level: string;
};

const CourseCard = ({
  courseId,
  category,
  title,
  description,
  duration,
  level,
}: CourseCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #DCE6ED',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(20, 55, 80, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          height: 8,
          bgcolor: '#0B5A91',
        }}
      />

      <Box
        sx={{
          p: { xs: 2.5, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {category}
          </Typography>

          <Chip
            label={level}
            size="small"
            sx={{
              bgcolor: '#EEF6FC',
              color: '#315A76',
              fontWeight: 600,
            }}
          />
        </Stack>

        <Typography
          variant="h6"
          sx={{
            color: '#244A66',
            fontWeight: 700,
            mt: 2,
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#657887',
            mt: 1,
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            mt: 3,
            color: '#657887',
            alignItems: 'center',
          }}
        >
          <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">{duration}</Typography>
        </Stack>

        <Button
          component={RouterLink}
          to={`/courses/${courseId}`}
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          fullWidth
          sx={{
            mt: 2,
            py: 1.1,
            borderColor: '#AFC2D0',
            color: '#0B5A91',
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          View course
        </Button>
      </Box>
    </Paper>
  );
};

export default CourseCard;
