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
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const capabilities = [
  {
    icon: <SchoolOutlinedIcon />,
    title: 'Structured Training Programmes',
    text: 'Create and deliver organized learning programmes with courses, modules and clear learning outcomes.',
  },
  {
    icon: <MenuBookOutlinedIcon />,
    title: 'Digital Learning Resources',
    text: 'Bring study material, presentations and recorded learning resources together inside course modules.',
  },
  {
    icon: <QuizOutlinedIcon />,
    title: 'Assessments & Evaluation',
    text: 'Support structured assessments, question-based evaluation, results and learner performance tracking.',
  },
  {
    icon: <WorkspacePremiumOutlinedIcon />,
    title: 'Certification & Outcomes',
    text: 'Connect successful learning completion with recognized certificates and measurable outcomes.',
  },
  {
    icon: <InsightsOutlinedIcon />,
    title: 'Progress & Analytics',
    text: 'Give trainees, trainers and administrators visibility into participation, progress and learning performance.',
  },
  {
    icon: <PsychologyOutlinedIcon />,
    title: 'AI-assisted Learning',
    text: 'Use Qwen-powered assistance for course structure, learning content, assessments and contextual learner support.',
  },
];

const roleCards = [
  {
    icon: <SchoolOutlinedIcon />,
    title: 'Trainee',
    text: 'Discover programmes, enrol in courses, study module resources, complete assessments, review results and continue learning from the right place.',
  },
  {
    icon: <GroupsOutlinedIcon />,
    title: 'Trainer',
    text: 'Create courses manually or with AI assistance, build modules, add resources and assessments, review learning content and publish approved programmes.',
  },
  {
    icon: <AdminPanelSettingsOutlinedIcon />,
    title: 'Administrator',
    text: 'Govern users, trainer applications, courses, assessments, certifications, announcements, analytics and platform activity.',
  },
];

const learningJourney = [
  'Discover a relevant training programme',
  'Enrol and follow structured course modules',
  'Use digital resources and AI-assisted learning support',
  'Complete assessments and review performance',
  'Build competencies and earn eligible certification',
];

const About = () => {
  return (
    <Box sx={{ bgcolor: '#F6F9FC' }}>
      <Box
        sx={{
          bgcolor: '#EAF4FB',
          borderBottom: '1px solid #D9E5EC',
          py: { xs: 5, md: 6.5 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
            }}
          >
            ABOUT CAPACITY CONNECT
          </Typography>

          <Typography
            sx={{
              mt: 1.25,
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.3rem' },
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              maxWidth: 920,
            }}
          >
            A digital learning and capacity-building platform for MoES and IMD.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 820,
              color: '#557083',
              fontSize: { xs: '1rem', md: '1.08rem' },
              lineHeight: 1.75,
            }}
          >
            CAPACITY CONNECT brings structured training, digital learning resources,
            assessments, competency development, certification and role-based
            collaboration into one secure learning environment.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ maxWidth: 800, mb: { xs: 3.5, md: 4.5 } }}>
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 800,
              fontSize: '.76rem',
              letterSpacing: '.12em',
            }}
          >
            WHY CAPACITY CONNECT
          </Typography>
          <Typography
            variant="h4"
            sx={{
              mt: 1,
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '1.85rem', md: '2.35rem' },
            }}
          >
            One connected learning environment
          </Typography>
          <Typography sx={{ mt: 1.2, color: '#657887', lineHeight: 1.75 }}>
            The platform is designed around the complete capacity-building journey:
            learning is organized into courses and modules, resources and assessments
            live alongside that learning, and progress can be tracked across roles.
          </Typography>
        </Box>

        <Grid container spacing={2.25}>
          {capabilities.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid #DCE7EE',
                  borderRadius: 2.5,
                  bgcolor: '#FFFFFF',
                }}
              >
                <CardContent sx={{ p: { xs: 2.75, md: 3 } }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.75,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: '#EAF5FC',
                      color: '#0B5A91',
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography sx={{ color: '#244A66', fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.9, color: '#657887', lineHeight: 1.65 }}
                  >
                    {item.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: { xs: 5.5, md: 7 } }}>
          <Box sx={{ maxWidth: 800, mb: 3.5 }}>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 800,
                fontSize: '.76rem',
                letterSpacing: '.12em',
              }}
            >
              ROLE-BASED BY DESIGN
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 1,
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '1.85rem', md: '2.35rem' },
              }}
            >
              The right workspace for every role
            </Typography>
          </Box>

          <Grid container spacing={2.25}>
            {roleCards.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid #DCE7EE',
                    borderRadius: 2.5,
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.75, md: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 1.75,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: '#EDF5FB',
                          color: '#0B5A91',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography sx={{ color: '#244A66', fontWeight: 800 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1.5, color: '#657887', lineHeight: 1.7 }}
                    >
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: { xs: 5.5, md: 7 } }}>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid #DCE7EE',
                  borderRadius: 2.5,
                  bgcolor: '#FFFFFF',
                }}
              >
                <CardContent sx={{ p: { xs: 2.75, md: 3.25 } }}>
                  <Typography
                    sx={{ color: '#0B5A91', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.12em' }}
                  >
                    LEARNING JOURNEY
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}
                  >
                    From discovery to recognized outcomes
                  </Typography>
                  <Stack spacing={1.7} sx={{ mt: 2.5 }}>
                    {learningJourney.map((step, index) => (
                      <Box key={step} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: '#0B5A91',
                            color: '#FFFFFF',
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography sx={{ color: '#4F6879', lineHeight: 1.55 }}>
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid #DCE7EE',
                  borderRadius: 2.5,
                  bgcolor: '#EFF7FC',
                }}
              >
                <CardContent sx={{ p: { xs: 2.75, md: 3.25 } }}>
                  <Typography
                    sx={{ color: '#0B5A91', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.12em' }}
                  >
                    AI-ASSISTED CAPACITY BUILDING
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}
                  >
                    AI supports the workflow; people remain in control
                  </Typography>
                  <Typography sx={{ mt: 1.5, color: '#5B7385', lineHeight: 1.75 }}>
                    Trainers can use AI to draft course structures, learning material
                    and assessment questions, then review and edit the generated content
                    before it becomes part of the learning experience. Learners can also
                    use contextual AI assistance while working with their course activity.
                  </Typography>
                  <Box
                    sx={{
                      mt: 2.5,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#FFFFFF',
                      border: '1px solid #D8E8F2',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#4F6879', lineHeight: 1.65 }}>
                      AI is an assistive layer around the LMS—not a replacement for trainer
                      review, institutional governance or learner assessment.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mt: { xs: 5.5, md: 7 },
            p: { xs: 2.75, md: 3.5 },
            borderRadius: 2.5,
            bgcolor: '#FFFFFF',
            border: '1px solid #DCE7EE',
          }}
        >
          <Typography
            sx={{ color: '#0B5A91', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.12em' }}
          >
            INSTITUTIONAL PURPOSE
          </Typography>
          <Typography
            variant="h5"
            sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}
          >
            Supporting continuous professional development
          </Typography>
          <Typography sx={{ mt: 1.3, color: '#657887', lineHeight: 1.75, maxWidth: 940 }}>
            CAPACITY CONNECT is intended to provide a centralized digital environment
            where capacity-building activity can be organized, delivered, evaluated
            and improved across the learning lifecycle. The platform combines role-based
            workspaces with learning content, assessments, certification, analytics and
            AI-assisted support so that the system remains useful to both learners and
            institutions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
