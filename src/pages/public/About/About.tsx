import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const features = [
  {
    icon: <SchoolOutlinedIcon />,
    title: 'Structured Learning',
    text: 'Access organized training programmes, courses and assessments through one platform.',
  },
  {
    icon: <GroupsOutlinedIcon />,
    title: 'Role-based Platform',
    text: 'Dedicated experiences for trainees, trainers and administrators.',
  },
  {
    icon: <InsightsOutlinedIcon />,
    title: 'Learning & Performance',
    text: 'Track participation, assessment outcomes, progress and professional development.',
  },
];

const About = () => {
  return (
    <Box sx={{ bgcolor: '#F5F9FC' }}>
      <Box
        sx={{
          bgcolor: '#EAF4FB',
          borderBottom: '1px solid #DCE6ED',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            About the platform
          </Typography>

          <Typography
            variant="h2"
            sx={{
              mt: 1.5,
              color: '#173F60',
              fontWeight: 700,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
              lineHeight: 1.15,
            }}
          >
            Building capacity through connected learning
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 820,
              color: '#5D7486',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
            }}
          >
            CAPACITY CONNECT is a digital capacity building and learning
            management platform designed to support structured training,
            accessible learning resources, assessments and continuous
            professional development.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            color: '#173F60',
            fontWeight: 700,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
          }}
        >
          What CAPACITY CONNECT provides
        </Typography>

        <Typography
          sx={{
            mt: 1,
            maxWidth: 760,
            color: '#657887',
            lineHeight: 1.7,
          }}
        >
          A centralized environment that brings learning, resources,
          assessments and professional development together.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid #DCE6ED',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                  <Box sx={{ color: '#0B5A91', mb: 2 }}>
                    {feature.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#244A66',
                      fontWeight: 700,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      color: '#657887',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            p: { xs: 3, md: 4 },
            bgcolor: '#FFFFFF',
            border: '1px solid #DCE6ED',
            borderRadius: 2,
          }}
        >
          <Stack spacing={1.5}>
            <Typography
              variant="h5"
              sx={{
                color: '#173F60',
                fontWeight: 700,
              }}
            >
              Designed for continuous professional development
            </Typography>

            <Typography
              sx={{
                color: '#657887',
                lineHeight: 1.8,
                maxWidth: 900,
              }}
            >
              The platform supports the complete learning journey—from
              discovering training programmes and accessing digital resources
              to completing assessments, receiving feedback and tracking
              learning outcomes.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
