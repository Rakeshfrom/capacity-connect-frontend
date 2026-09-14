import {
  Assessment,
  AutoStories,
  EmojiEvents,
  Groups,
  Insights,
  LibraryBooks,
  NotificationsActive,
  WorkspacePremium,
} from '@mui/icons-material';
import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';

const features = [
  {
    icon: <AutoStories />,
    title: 'Learning Management',
    description: 'Discover courses, enroll in programmes and track your learning journey.',
  },
  {
    icon: <LibraryBooks />,
    title: 'Digital Resources',
    description: 'Access learning materials, trainer resources and institutional knowledge.',
  },
  {
    icon: <Assessment />,
    title: 'Assessments',
    description: 'Evaluate knowledge through structured assessments and performance tracking.',
  },
  {
    icon: <WorkspacePremium />,
    title: 'Certification',
    description: 'Earn verifiable certificates after completing eligible learning programmes.',
  },
  {
    icon: <Groups />,
    title: 'Trainer Workspace',
    description: 'Create courses, manage resources, questionnaires and trainee activities.',
  },
  {
    icon: <Insights />,
    title: 'Analytics',
    description: 'Use learning and participation insights to support better decisions.',
  },
  {
    icon: <EmojiEvents />,
    title: 'Competency Development',
    description: 'Connect learning activities with skills and competency development.',
  },
  {
    icon: <NotificationsActive />,
    title: 'Announcements',
    description: 'Stay informed about programmes, updates, achievements and opportunities.',
  },
];

const FeaturesSection = () => (
  <Box id="features" sx={{ py: { xs: 5.5, md: 7 }, backgroundColor: '#f7f9fc' }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, letterSpacing: 1.5 }}
        >
          PLATFORM CAPABILITIES
        </Typography>

        <Typography
          variant="h3"
          sx={{
            mt: 1,
            fontWeight: 800,
            fontSize: { xs: '1.85rem', md: '2.35rem' },
          }}
        >
          Everything for Capacity Building
        </Typography>

        <Typography
          sx={{
            mt: 1.15,
            maxWidth: 720,
            mx: 'auto',
            color: 'text.secondary',
            fontSize: '0.98rem',
          }}
        >
          A unified digital platform for learning, assessment, competency
          development, certification and institutional collaboration.
        </Typography>
      </Box>

      <Grid container spacing={1.75}>
        {features.map((feature) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                transition: '0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 24px rgba(20,55,80,.08)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.2, md: 2.45 } }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    mb: 1.6,
                  }}
                >
                  {feature.icon}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 750, mb: 0.75, fontSize: '1rem' }}>
                  {feature.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default FeaturesSection;
